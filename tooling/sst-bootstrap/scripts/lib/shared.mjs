import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CreateSecretCommand,
  DescribeSecretCommand,
  GetSecretValueCommand,
  UpdateSecretCommand,
} from "@aws-sdk/client-secrets-manager";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** Monorepo root (this file lives in scripts/lib/) */
export const REPO_ROOT = join(__dirname, "../../../..");
export const DEFAULT_ENV_FILE = join(REPO_ROOT, ".env");

export function isSecretsManagerArn(s) {
  return /^arn:aws:secretsmanager:/i.test(s.trim());
}

/** `{stage}-{base}` when stage set; ARN unchanged */
export function resolveSecretId(baseRaw, stageRaw) {
  const base = baseRaw.trim();
  if (!base) return base;
  if (isSecretsManagerArn(base)) return base;
  const stage = stageRaw?.trim().replace(/^\/+|\/+$/g, "");
  if (!stage) return base;
  return `${stage}-${base}`;
}

export function parseGlobalFlags(argv, startIdx) {
  const out = {
    dryRun: false,
    secretName: null,
    stage: null,
    region: null,
    profile: null,
    file: null,
    outFile: DEFAULT_ENV_FILE,
  };
  for (let i = startIdx; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--") continue;
    if (a === "--dry-run") out.dryRun = true;
    else if (
      (a === "--path" || a === "--secret-name") &&
      argv[i + 1]
    )
      out.secretName = argv[++i];
    else if (a === "--stage" && argv[i + 1]) out.stage = argv[++i];
    else if (a === "--region" && argv[i + 1]) out.region = argv[++i];
    else if (a === "--profile" && argv[i + 1]) out.profile = argv[++i];
    else if (a === "--file" && argv[i + 1]) out.file = argv[++i];
    else if (a === "--out" && argv[i + 1]) out.outFile = argv[++i];
    else if (a === "--help" || a === "-h") return { help: true };
  }
  return { ...out, help: false };
}

export function applyProfile(profile) {
  if (profile) process.env.AWS_PROFILE = profile;
}

export function resolveRegion(args) {
  return (
    (args.region?.trim() || undefined) ??
    process.env.AWS_REGION?.trim() ??
    process.env.SST_AWS_REGION?.trim() ??
    "us-east-1"
  );
}

export function resolveStage(args) {
  return (
    (args.stage?.trim() || undefined) ??
    process.env.SST_STAGE?.trim() ??
    process.env.STAGE?.trim()
  );
}

export function resolveSecretBase(args) {
  return (
    args.secretName ??
    process.env.SECRET_NAME?.trim() ??
    process.env.SSM_ENV_PATH?.trim()
  );
}

export function parseDotenv(content) {
  const out = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const withoutExport = trimmed.startsWith("export ")
      ? trimmed.slice(7).trim()
      : trimmed;
    const eq = withoutExport.indexOf("=");
    if (eq === -1) continue;
    const key = withoutExport.slice(0, eq).trim();
    let val = withoutExport.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

export function formatEnvLine(key, value) {
  const needsQuote =
    /[\s#]/.test(value) ||
    value.includes("\n") ||
    value.includes('"') ||
    value === "";
  if (!needsQuote) return `${key}=${value}`;
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
  return `${key}="${escaped}"`;
}

export function serializeEnv(obj) {
  const keys = Object.keys(obj).sort((a, b) => a.localeCompare(b));
  return keys.map((k) => formatEnvLine(k, obj[k])).join("\n") + "\n";
}

export function secretStringToEnvMap(secretString) {
  const t = secretString.trim();
  try {
    const parsed = JSON.parse(t);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const out = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (v === null || v === undefined) continue;
        out[k] = typeof v === "object" ? JSON.stringify(v) : String(v);
      }
      return out;
    }
  } catch {
    /* plain */
  }
  const plainKey =
    process.env.SECRETS_MANAGER_PLAIN_KEY?.trim() || "SECRET_VALUE";
  return { [plainKey]: t };
}

export async function fetchSecret(client, secretId) {
  const res = await client.send(
    new GetSecretValueCommand({ SecretId: secretId }),
  );
  if (res.SecretString != null && res.SecretString !== "") {
    return secretStringToEnvMap(res.SecretString);
  }
  if (res.SecretBinary != null) {
    console.error(
      "Secret is binary-only; use SecretString (JSON or text) for env pull/push.",
    );
    process.exit(1);
  }
  return {};
}

export async function putSecret(client, secretId, secretString) {
  try {
    await client.send(new DescribeSecretCommand({ SecretId: secretId }));
    await client.send(
      new UpdateSecretCommand({ SecretId: secretId, SecretString: secretString }),
    );
    return;
  } catch (e) {
    if (e.name !== "ResourceNotFoundException") throw e;
  }
  try {
    await client.send(
      new CreateSecretCommand({
        Name: secretId,
        SecretString: secretString,
      }),
    );
  } catch (e) {
    if (e.name === "ResourceExistsException") {
      await client.send(
        new UpdateSecretCommand({
          SecretId: secretId,
          SecretString: secretString,
        }),
      );
      return;
    }
    throw e;
  }
}

export function fileToSecretString(absPath) {
  const raw = readFileSync(absPath, "utf8");
  const lower = absPath.toLowerCase();
  if (lower.endsWith(".json")) {
    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error("JSON secret file must be a single object at the root.");
    }
    return JSON.stringify(parsed);
  }
  const obj = parseDotenv(raw);
  if (Object.keys(obj).length === 0) {
    throw new Error(`No key=value pairs parsed from ${absPath}`);
  }
  return JSON.stringify(obj);
}
