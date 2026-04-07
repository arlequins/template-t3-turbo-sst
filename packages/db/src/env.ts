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
};

/** Parses `GLOBAL_DATABASE_SSL` string values for `postgres` / RDS-style flags. */
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
 * Validated `GLOBAL_DATABASE_*` from the environment (t3-env).
 * Use `loadDatabaseEnv()` for the shape expected by `postgres` / Drizzle.
 */
const databaseEnv = createEnv({
  server: {
    GLOBAL_DATABASE_HOST: z.string().min(1),
    GLOBAL_DATABASE_PORT: z.coerce.number().int().min(1).max(65535),
    GLOBAL_DATABASE_USER: z.string().min(1),
    GLOBAL_DATABASE_PASSWORD: z.string().min(1),
    GLOBAL_DATABASE_NAME: z.string().min(1),
    GLOBAL_DATABASE_SSL: databaseSslSchema,
  },
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});

/** Shared by `client.ts` and `drizzle.config.ts`. */
export function loadDatabaseEnv(): DatabaseEnv {
  return {
    host: databaseEnv.GLOBAL_DATABASE_HOST,
    port: databaseEnv.GLOBAL_DATABASE_PORT,
    user: databaseEnv.GLOBAL_DATABASE_USER,
    password: databaseEnv.GLOBAL_DATABASE_PASSWORD,
    database: databaseEnv.GLOBAL_DATABASE_NAME,
    ssl: databaseEnv.GLOBAL_DATABASE_SSL,
  };
}
