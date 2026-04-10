import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

import { skipEnvValidation } from "./skip-validation.js";

/** Default for `SST_AWS_REGION` (Zod + {@link sstAwsRegion} fallback when validation is skipped). */
export const DEFAULT_SST_AWS_REGION = "us-east-1" as const;
/** Default Nitro preset for `apps/api` (`vite.config`); AWS Lambda + streaming. */
export const DEFAULT_NITRO_PRESET = "aws-lambda" as const;

/**
 * Single source of truth for `process.env` reads in this package.
 * All keys used by `@acme/env` are listed in `server` + `runtimeEnv` (no scattered `process.env`).
 *
 * Apps should prefer `extends: [globalEnv()]` in their own `createEnv` (see `apps/api/src/env.ts`).
 */
export const serverEnv = createEnv({
  server: {
    /** Deploy / workspace name; may be a personal sandbox (not always a known `DeployStage`). */
    SST_STAGE: z.string().optional(),
    /** Local AWS named profile for `sst dev` / CLI; omit in CI. */
    SST_AWS_PROFILE: z.string().optional(),
    /** Region for SST `providers.aws.region`; use {@link sstAwsRegion} for a guaranteed `string`. */
    SST_AWS_REGION: z.string().optional().default(DEFAULT_SST_AWS_REGION),
    /** Nitro deploy preset (`apps/api` Vite); use {@link nitroPreset} for a guaranteed `string`. */
    NITRO_PRESET: z.string().optional().default(DEFAULT_NITRO_PRESET),
    /** Optional documentation / tooling; Lambda VPC uses subnet + SG ids only. */
    VPC_ID: z.string().optional(),
    /** Comma-separated subnet ids; if empty with SG, Lambdas are not placed in a VPC. */
    SUBNET_IDS: z.string().optional(),
    SECURITY_GROUP_IDS: z.string().optional(),

    DATABASE_HOST: z.string().optional(),
    DATABASE_PORT: z.string().optional(),
    DATABASE_USER: z.string().optional(),
    DATABASE_PASSWORD: z.string().optional(),
    DATABASE_NAME: z.string().optional(),
    POSTGRES_POOL_MAX: z.string().optional(),
  },
  runtimeEnv: {
    SST_STAGE: process.env.SST_STAGE,
    SST_AWS_PROFILE: process.env.SST_AWS_PROFILE,
    SST_AWS_REGION: process.env.SST_AWS_REGION,
    NITRO_PRESET: process.env.NITRO_PRESET,
    VPC_ID: process.env.VPC_ID,
    SUBNET_IDS: process.env.SUBNET_IDS,
    SECURITY_GROUP_IDS: process.env.SECURITY_GROUP_IDS,

    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    POSTGRES_POOL_MAX: process.env.POSTGRES_POOL_MAX,
  },
  emptyStringAsUndefined: true,
  skipValidation: skipEnvValidation,
});

/**
 * For `createEnv({ extends: [globalEnv(), …] })` — same validated object as {@link serverEnv}.
 */
export function globalEnv() {
  return serverEnv;
}

/**
 * SST `providers.aws.region` — always a non-empty string (matches Zod default; covers `skipValidation` / loose typing).
 */
export function sstAwsRegion(): string {
  const r = serverEnv.SST_AWS_REGION;
  if (typeof r === "string" && r.trim().length > 0) {
    return r.trim();
  }
  return DEFAULT_SST_AWS_REGION;
}

/**
 * Nitro `preset` for `apps/api` Vite config — always a non-empty string (Zod default + `skipValidation` fallback).
 */
export function nitroPreset(): string {
  const p = serverEnv.NITRO_PRESET;
  if (typeof p === "string" && p.trim().length > 0) {
    return p.trim();
  }
  return DEFAULT_NITRO_PRESET;
}
