/// <reference types="node" />
import type { Config } from "drizzle-kit";

import { loadMainDatabaseEnv } from "./src/main-database-env";

const dbEnv = loadMainDatabaseEnv();

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
    ssl: dbEnv.ssl,
  },
  casing: "snake_case",
} satisfies Config;
