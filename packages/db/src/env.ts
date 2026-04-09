import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

type DatabaseSsl = boolean | "require" | "allow" | "prefer" | "verify-full";

type DatabaseEnv = {
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
 * Validated `DATABASE_*` from the environment (t3-env).
 * Use `loadDatabaseEnv()` for the shape expected by `postgres` / Drizzle.
 */
const databaseEnv = createEnv({
  server: {
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
  },
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});

/** Shared by `client.ts` and `drizzle.config.ts`. */
export function loadDatabaseEnv(): DatabaseEnv {
  return {
    host: databaseEnv.DATABASE_HOST,
    port: databaseEnv.DATABASE_PORT,
    user: databaseEnv.DATABASE_USER,
    password: databaseEnv.DATABASE_PASSWORD,
    database: databaseEnv.DATABASE_NAME,
    ssl: databaseEnv.DATABASE_SSL,
    poolMax: databaseEnv.POSTGRES_POOL_MAX,
  };
}
