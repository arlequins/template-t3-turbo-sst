/// <reference types="node" />
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { sql } from "drizzle-orm";

import { db } from "../src/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedsRoot = join(__dirname, "seeds");

async function ensureSeedsLedgerTable() {
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS drizzle`);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_seeds (
      id serial PRIMARY KEY NOT NULL,
      name text NOT NULL,
      applied_at timestamptz DEFAULT now() NOT NULL,
      CONSTRAINT __drizzle_seeds_name_unique UNIQUE (name)
    )
  `);
}

async function loadAppliedSeedNames(): Promise<Set<string>> {
  const rows = await db.execute(
    sql`SELECT name FROM drizzle.__drizzle_seeds`,
  );
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
        sql`INSERT INTO drizzle.__drizzle_seeds (name) VALUES (${fileName})`,
      );
    });
    console.log(`Seeded: ${fileName}`);
  }

  console.log("All seeds completed.");
}

await main();
