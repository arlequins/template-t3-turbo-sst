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
  async run() {
    new sst.aws.TanStackStart("Api", {
      path: ".",
      buildCommand: "pnpm run build",
      environment: {
        NODE_ENV: "production",
        MAIN_DATABASE_HOST: process.env.MAIN_DATABASE_HOST ?? "",
        MAIN_DATABASE_PORT: process.env.MAIN_DATABASE_PORT ?? "",
        MAIN_DATABASE_USER: process.env.MAIN_DATABASE_USER ?? "",
        MAIN_DATABASE_PASSWORD: process.env.MAIN_DATABASE_PASSWORD ?? "",
        MAIN_DATABASE_NAME: process.env.MAIN_DATABASE_NAME ?? "",
        MAIN_DATABASE_SSL: process.env.MAIN_DATABASE_SSL ?? "",
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
