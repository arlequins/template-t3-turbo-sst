/// <reference types="node" />

import { loadDatabaseEnv } from "@acme/env";
import type { Config } from "drizzle-kit";

const dbEnv = loadDatabaseEnv();

export default {
  schema: ["./src/schema.ts"],
  dialect: "postgresql",
  schemaFilter: ["sample"],
  dbCredentials: {
    host: dbEnv.host,
    port: dbEnv.port,
    user: dbEnv.user,
    password: dbEnv.password,
    database: dbEnv.database,
  },
  casing: "snake_case",
} satisfies Config;
