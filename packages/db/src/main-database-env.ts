export type MainDatabaseSsl =
  | boolean
  | "require"
  | "allow"
  | "prefer"
  | "verify-full";

export type MainDatabaseEnv = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: MainDatabaseSsl;
};

function parseSsl(value: string): MainDatabaseSsl {
  const v = value.trim().toLowerCase();
  if (v === "false" || v === "0" || v === "off") return false;
  if (v === "require") return "require";
  if (v === "allow") return "allow";
  if (v === "prefer") return "prefer";
  if (v === "verify-full") return "verify-full";
  if (v === "true" || v === "1" || v === "on") return true;
  return true;
}

/** Shared by `client.ts` and `drizzle.config.ts`. */
export function loadMainDatabaseEnv(): MainDatabaseEnv {
  const host = process.env.MAIN_DATABASE_HOST;
  const portStr = process.env.MAIN_DATABASE_PORT;
  const user = process.env.MAIN_DATABASE_USER;
  const password = process.env.MAIN_DATABASE_PASSWORD;
  const database = process.env.MAIN_DATABASE_NAME;
  const sslStr = process.env.MAIN_DATABASE_SSL;

  if (!host || !portStr || !user || !password || !database || !sslStr) {
    throw new Error("Missing MAIN_DATABASE_ environment variables");
  }

  const port = Number(portStr);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      `MAIN_DATABASE_PORT must be an integer 1–65535, got: ${portStr}`,
    );
  }

  return {
    host,
    port,
    user,
    password,
    database,
    ssl: parseSsl(sslStr),
  };
}
