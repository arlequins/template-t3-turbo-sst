#!/usr/bin/env node
/**
 * GetSecretValue → overwrite `--out` with SM contents only (see `lib/shared.mjs`).
 */
import { writeFileSync } from "node:fs";
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import {
  applyProfile,
  fetchSecret,
  parseGlobalFlags,
  resolveRegion,
  resolveSecretBase,
  resolveSecretId,
  resolveStage,
  serializeEnv,
} from "./lib/shared.mjs";

function printPullHelp() {
  console.log(`Usage: node pull-secret-env.mjs [options]

Options:
  --secret-name, --path <base>   Secret base name (with stage → {stage}-{base}); or full ARN
  --stage <STAGE>               Prefix: SST_STAGE / STAGE
  --region, --profile, --out, --dry-run

Environment:
  SECRET_NAME (legacy: SSM_ENV_PATH)   Secret base name or ARN
  SST_STAGE / STAGE
  SECRETS_MANAGER_PLAIN_KEY   When secret is plain text (pull → one env key, default SECRET_VALUE)
  AWS_REGION / SST_AWS_REGION   Default us-east-1
  AWS_PROFILE / SST_AWS_PROFILE
`);
}

async function main() {
  const argv = process.argv.slice(2).filter((a) => a !== "--");
  const args = parseGlobalFlags(argv, 0);
  if (args.help) {
    printPullHelp();
    return;
  }
  const base = resolveSecretBase(args);
  if (!base?.trim()) {
    console.error(
      "pull: set SECRET_NAME or pass --secret-name (secret base name or ARN)",
    );
    process.exit(1);
  }
  const stage = resolveStage(args);
  const secretId = resolveSecretId(base, stage);
  applyProfile(
    (args.profile?.trim() || undefined) ??
    process.env.AWS_PROFILE?.trim() ??
    process.env.SST_AWS_PROFILE?.trim(),
  );
  const region = resolveRegion(args);
  const client = new SecretsManagerClient({ region });

  let fromRemote;
  try {
    fromRemote = await fetchSecret(client, secretId);
  } catch (e) {
    console.error("GetSecretValue failed:", e.message ?? e);
    process.exit(1);
  }

  if (Object.keys(fromRemote).length === 0) {
    console.warn(`No keys parsed from secret: ${secretId}`);
  }

  const body = serializeEnv(fromRemote);
  if (args.dryRun) {
    console.log(body);
    return;
  }
  writeFileSync(args.outFile, body, "utf8");
  console.log(
    `Wrote ${Object.keys(fromRemote).length} key(s) from ${secretId} into ${args.outFile} (replaced file).`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
