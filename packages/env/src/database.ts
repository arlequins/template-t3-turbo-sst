import { z } from "zod/v4";

import { serverEnv } from "./env-server.js";

type DatabaseSsl = boolean | "require" | "allow" | "prefer" | "verify-full";

export type DatabaseEnv = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: DatabaseSsl;
  poolMax: number;
};

/** Parses `DATABASE_SSL` string values for `postgres` / RDS-style flags. */
const databaseSslSchema = z
  .string()
  .min(1)
  .transform((raw): DatabaseSsl => {
    const v = raw.trim().toLowerCase();
    if (v === "false" || v === "0" || v === "off") return false;
    if (v === "require") return "require";
    if (v === "allow") return "allow";
    if (v === "prefer") return "prefer";
    if (v === "verify-full") return "verify-full";
    if (v === "true" || v === "1" || v === "on") return true;
    return true;
  });

/**
 * Strict connection shape — values come from {@link serverEnv} (validated at load time).
 * Use `loadDatabaseEnv()` for the shape expected by `postgres` / Drizzle.
 */
const databaseConnectionSchema = z.object({
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().int().min(1).max(65535),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  DATABASE_SSL: databaseSslSchema,
  POSTGRES_POOL_MAX: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : val),
    z.coerce.number().int().min(1).max(500).default(10),
  ),
});

/** Shared by `@acme/db` `client.ts` and `drizzle.config.ts`. */
export function loadDatabaseEnv(): DatabaseEnv {
  const row = databaseConnectionSchema.parse({
    DATABASE_HOST: serverEnv.DATABASE_HOST,
    DATABASE_PORT: serverEnv.DATABASE_PORT,
    DATABASE_USER: serverEnv.DATABASE_USER,
    DATABASE_PASSWORD: serverEnv.DATABASE_PASSWORD,
    DATABASE_NAME: serverEnv.DATABASE_NAME,
    DATABASE_SSL: serverEnv.DATABASE_SSL,
    POSTGRES_POOL_MAX: serverEnv.POSTGRES_POOL_MAX,
  });
  return {
    host: row.DATABASE_HOST,
    port: row.DATABASE_PORT,
    user: row.DATABASE_USER,
    password: row.DATABASE_PASSWORD,
    database: row.DATABASE_NAME,
    ssl: row.DATABASE_SSL,
    poolMax: row.POSTGRES_POOL_MAX,
  };
}
