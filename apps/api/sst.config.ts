/// <reference path="./sst-globals.d.ts" />

/**
 * TanStack Start on AWS via SST `TanStackStart` (CloudFront + S3 static assets + Lambda SSR).
 * Matches https://sst.dev/docs/start/aws/tanstack/ — Nitro `aws-lambda` + streaming in `vite.config.ts`.
 *
 * Run SST from `apps/api`. Deploy runs `buildCommand` internally (no need to pre-run `vite build`).
 *
 * `environment` reads `process.env` when SST runs. Monorepo: use `pnpm with-env sst deploy`
 * (see package.json) so repo-root `.env` is loaded; CI should export the same variables.
 */
export default $config({
  app(input) {
    const localAwsProfile = process.env.SST_AWS_PROFILE?.trim();
    const region = process.env.SST_AWS_REGION?.trim() ?? "us-east-1";

    return {
      name: "api",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: input?.stage === "production",
      home: "aws",
      providers: {
        aws: {
          region,
          ...(localAwsProfile ? { profile: localAwsProfile } : {}),
        },
      },
    };
  },
  // TODO: lambda configを追加
  async run() {
    new sst.aws.TanStackStart("Api", {
      path: ".",
      buildCommand: "pnpm run build",
      environment: {
        NODE_ENV: "production",
        GLOBAL_DATABASE_HOST: process.env.GLOBAL_DATABASE_HOST ?? "",
        GLOBAL_DATABASE_PORT: process.env.GLOBAL_DATABASE_PORT ?? "",
        GLOBAL_DATABASE_USER: process.env.GLOBAL_DATABASE_USER ?? "",
        GLOBAL_DATABASE_PASSWORD: process.env.GLOBAL_DATABASE_PASSWORD ?? "",
        GLOBAL_DATABASE_NAME: process.env.GLOBAL_DATABASE_NAME ?? "",
        GLOBAL_DATABASE_SSL: process.env.GLOBAL_DATABASE_SSL ?? "",
      },
      dev: {
        command: "pnpm with-env vite dev",
        directory: ".",
        title: "tanstack-start",
        url: "http://localhost:5000",
      },
    });
  },
});
