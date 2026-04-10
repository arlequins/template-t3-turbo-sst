/// <reference path="./sst-globals.d.ts" />

import { LambdaEnvironment } from "@acme/env";

/**
 * TanStack Start on AWS via SST `TanStackStart` (CloudFront + S3 static assets + Lambda SSR).
 * Matches https://sst.dev/docs/start/aws/tanstack/ — Nitro `aws-lambda` + streaming in `vite.config.ts`.
 *
 * SST disallows top-level imports — `@acme/env` is loaded via dynamic `import()` in `app` / `run`.
 * `app()` uses validated {@link serverEnv}, {@link sstAwsRegion}, {@link Stage}.
 *
 * `environment` uses `serverEnv` when SST runs. Monorepo: use `pnpm with-env sst deploy`; CI should export the same variables.
 */
export default $config({
  async app(input) {
    const { serverEnv, sstAwsRegion, Stage } = await import("@acme/env");
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
    const { vpcFromEnv, DEFAULT_LOCALHOST_API_URL } = await import("@acme/env");

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
      environment: LambdaEnvironment,
      dev: {
        command: "pnpm with-env vite dev",
        directory: ".",
        title: "tanstack-start",
        url: DEFAULT_LOCALHOST_API_URL,
      },
    });
  },
});
