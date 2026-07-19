import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

import { skipEnvValidation } from "./skip-validation.js";

/** Default for `SST_AWS_REGION` (Zod + {@link sstAwsRegion} fallback when validation is skipped). */
export const DEFAULT_SST_AWS_REGION = "us-east-1" as const;
/**
 * Single source of truth for `process.env` reads in this package.
 * All keys used by `@acme/env` are listed in `server` + `runtimeEnv` (no scattered `process.env`).
 *
 * Apps should import this validated object instead of reading `process.env` directly.
 */
export const serverEnv = createEnv({
  server: {
    /** Deploy / workspace name; may be a personal sandbox (not always a known `DeployStage`). */
    SST_STAGE: z.string().optional(),
    /** Local AWS named profile for `sst dev` / CLI; omit in CI. */
    SST_AWS_PROFILE: z.string().optional(),
    /** Region for SST `providers.aws.region`; use {@link sstAwsRegion} for a guaranteed `string`. */
    SST_AWS_REGION: z.string().optional().default(DEFAULT_SST_AWS_REGION),
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
    /** OIDC issuer expected in API access tokens. */
    OIDC_ISSUER_URL: z.url().optional(),
    /** OAuth resource-server audience expected in API access tokens. */
    OIDC_AUDIENCE: z.string().min(1).optional(),
    /** Optional discovery override for providers with a non-standard JWKS URI. */
    OIDC_JWKS_URI: z.url().optional(),
    /** Comma-separated asymmetric JWT algorithms accepted by the API. */
    OIDC_ALLOWED_ALGORITHMS: z.string().optional(),
    /** Comma-separated browser origins accepted by the Hono API. */
    API_CORS_ORIGINS: z.string().optional(),
    /** Local Hono server port. */
    API_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  },
  runtimeEnv: {
    SST_STAGE: process.env.SST_STAGE,
    SST_AWS_PROFILE: process.env.SST_AWS_PROFILE,
    SST_AWS_REGION: process.env.SST_AWS_REGION,
    VPC_ID: process.env.VPC_ID,
    SUBNET_IDS: process.env.SUBNET_IDS,
    SECURITY_GROUP_IDS: process.env.SECURITY_GROUP_IDS,

    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_NAME: process.env.DATABASE_NAME,
    POSTGRES_POOL_MAX: process.env.POSTGRES_POOL_MAX,
    OIDC_ISSUER_URL: process.env.OIDC_ISSUER_URL,
    OIDC_AUDIENCE: process.env.OIDC_AUDIENCE,
    OIDC_JWKS_URI: process.env.OIDC_JWKS_URI,
    OIDC_ALLOWED_ALGORITHMS: process.env.OIDC_ALLOWED_ALGORITHMS,
    API_CORS_ORIGINS: process.env.API_CORS_ORIGINS,
    API_PORT: process.env.API_PORT,
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
