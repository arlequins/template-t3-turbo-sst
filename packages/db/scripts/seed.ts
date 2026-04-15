/**
 * Runs `scripts/seeds/*.ts` in filename order. Each file must default-export
 * `async ({ tx, stage }) => void` (`stage` comes from `resolveDeployStage()`).
 *
 * Applied seeds are recorded in `drizzle.__drizzle_seeds` by filename (e.g. `0000-init-client.ts`).
 */
/// <reference types="node" />
import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { sql } from "drizzle-orm";

import type { SeedRun } from "@acme/types";
import { resolveDeployStage } from "@acme/env";

import { closeDatabasePool, db } from "../src/client";

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
    const name = Reflect.get(row, "name");
    if (typeof name === "string") names.add(name);
  }
  return names;
}

async function listTsSeeds(): Promise<{ name: string; path: string }[]> {
  let entries;
  try {
    entries = await readdir(seedsRoot, { withFileTypes: true });
  } catch (e: unknown) {
    const code = e && typeof e === "object" && "code" in e ? e.code : undefined;
    if (code === "ENOENT") return [];
    throw e;
  }

  const out: { name: string; path: string }[] = [];
  for (const e of entries) {
    if (!e.isFile() || e.name.startsWith("_") || !e.name.endsWith(".ts")) {
      continue;
    }
    out.push({ name: e.name, path: join(seedsRoot, e.name) });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name, "en"));
}

async function main() {
  const stage = resolveDeployStage();
  console.log(`Seeds: stage = "${stage}"`);

  await ensureSeedsLedgerTable();

  const files = await listTsSeeds();
  if (files.length === 0) {
    console.log("No .ts files under scripts/seeds/.");
    return;
  }

  const applied = await loadAppliedSeedNames();

  for (const { name, path } of files) {
    if (applied.has(name)) {
      console.log(`Skip (already seeded): ${name}`);
      continue;
    }

    console.log(`Seeding: ${name} …`);
    const mod = (await import(pathToFileURL(path).href)) as {
      default?: unknown;
    };
    const run = mod.default;
    if (typeof run !== "function") {
      throw new Error(
        `Seed "${name}" must default-export async ({ tx, stage }) => …`,
      );
    }

    await db.transaction(async (tx) => {
      await (run as SeedRun<typeof tx>)({ tx, stage });
      await tx.execute(sql`INSERT INTO ${ledgerTable} (name) VALUES (${name})`);
    });

    applied.add(name);
    console.log(`Seeded: ${name}`);
  }

  console.log("All seeds completed.");
}

try {
  await main();
} finally {
  await closeDatabasePool();
}
