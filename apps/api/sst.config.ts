/// <reference path="./sst-globals.d.ts" />

import {
  DEFAULT_LOCALHOST_API_URL,
  serverEnv,
  sstAwsRegion,
  Stage,
  vpcFromEnv,
} from "@acme/env";

/**
 * TanStack Start on AWS via SST `TanStackStart` (CloudFront + S3 static assets + Lambda SSR).
 * Matches https://sst.dev/docs/start/aws/tanstack/ — Nitro `aws-lambda` + streaming in `vite.config.ts`.
 *
 * Run SST from `apps/api`. Deploy runs `buildCommand` internally (no need to pre-run `vite build`).
 *
 * `environment` uses `serverEnv` from `@acme/env` when SST runs. Monorepo: use `pnpm with-env sst deploy`
 * (see package.json) so repo-root `.env` is loaded; CI should export the same variables.
 */
export default $config({
  app(input) {
    const localAwsProfile = serverEnv.SST_AWS_PROFILE?.trim();
    const region = sstAwsRegion();

    return {
      name: "api",
      removal: input?.stage === Stage.PRODUCTION ? "retain" : "remove",
      protect: input?.stage === Stage.PRODUCTION,
      home: "aws",
      providers: {
        aws: {
          region,
          ...(localAwsProfile ? { profile: localAwsProfile } : {}),
        },
      },
    };
  },
  async run() {
    const vpc = vpcFromEnv();

    new sst.aws.TanStackStart("Api", {
      path: ".",
      buildCommand: "pnpm run build",
      ...(vpc
        ? {
            vpc: {
              subnets: vpc.subnetIds,
              securityGroups: vpc.securityGroups,
            },
          }
        : {}),
      environment: {
        NODE_ENV: "production",
        DATABASE_HOST: serverEnv.DATABASE_HOST!,
        DATABASE_PORT: serverEnv.DATABASE_PORT!,
        DATABASE_USER: serverEnv.DATABASE_USER!,
        DATABASE_PASSWORD: serverEnv.DATABASE_PASSWORD!,
        DATABASE_NAME: serverEnv.DATABASE_NAME!,
        DATABASE_SSL: serverEnv.DATABASE_SSL!,
      },
      dev: {
        command: "pnpm with-env vite dev",
        directory: ".",
        title: "tanstack-start",
        url: DEFAULT_LOCALHOST_API_URL,
      },
    });
  },
});
