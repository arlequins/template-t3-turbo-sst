import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { loadDatabaseEnv } from "./env";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

const dbEnv = loadDatabaseEnv();

/** RDS / long-lived Node: tune via POSTGRES_POOL_MAX (default 10). */
const client = postgres({
  host: dbEnv.host,
  port: dbEnv.port,
  user: dbEnv.user,
  password: dbEnv.password,
  database: dbEnv.database,
  ssl: dbEnv.ssl,
  max: Number(process.env.POSTGRES_POOL_MAX ?? 10),
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle({ client, schema, casing: "snake_case" });

/** Call after one-off scripts/tests so pooled DB connections do not delay process exit. */
export async function closeMainDatabasePool(): Promise<void> {
  await client.end({ timeout: 5 });
}
