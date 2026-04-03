/// <reference types="node" />
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { sql } from "drizzle-orm";

import { closeMainDatabasePool, db } from "../src/client";

const Config = {
  schema: "drizzle",
  table: "__drizzle_seeds",
} as const;

const ledgerTable = sql.raw(`"${Config.schema}"."${Config.table}"`);

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsRoot = join(__dirname, "seeds");

async function ensureSeedsLedgerTable() {
  await db.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "${Config.schema}"`));
  await db.execute(
    sql.raw(`
    CREATE TABLE IF NOT EXISTS "${Config.schema}"."${Config.table}" (
      id serial PRIMARY KEY NOT NULL,
      name text NOT NULL,
      applied_at timestamptz DEFAULT now() NOT NULL,
      CONSTRAINT "${Config.table}_name_unique" UNIQUE (name)
    )
  `),
  );
}

async function loadAppliedSeedNames(): Promise<Set<string>> {
  const rows = await db.execute(sql`SELECT name FROM ${ledgerTable}`);
  const names = new Set<string>();
  for (const row of rows) {
    const name = (row as Record<string, unknown>).name;
    if (typeof name === "string") names.add(name);
  }
  return names;
}

async function main() {
  await ensureSeedsLedgerTable();

  const entries = await readdir(seedsRoot, { withFileTypes: true });
  const seedFiles = entries
    .filter(
      (e) => e.isFile() && e.name.endsWith(".sql") && !e.name.startsWith("_"),
    )
    .map((e) => e.name)
    .sort((a, b) => a.localeCompare(b, "en"));

  if (seedFiles.length === 0) {
    console.log("No seed files under scripts/seeds.");
    return;
  }

  const applied = await loadAppliedSeedNames();

  for (const fileName of seedFiles) {
    if (applied.has(fileName)) {
      console.log(`Skip (already seeded): ${fileName}`);
      continue;
    }

    const seedPath = join(seedsRoot, fileName);
    const body = (await readFile(seedPath, "utf8")).trim();
    if (body.length === 0) {
      throw new Error(`Seed "${fileName}" is empty`);
    }

    console.log(`Seeding: ${fileName} …`);
    await db.transaction(async (tx) => {
      await tx.execute(sql.raw(body));
      await tx.execute(
        sql`INSERT INTO ${ledgerTable} (name) VALUES (${fileName})`,
      );
    });
    console.log(`Seeded: ${fileName}`);
  }

  console.log("All seeds completed.");
}

try {
  await main();
} finally {
  await closeMainDatabasePool();
}
