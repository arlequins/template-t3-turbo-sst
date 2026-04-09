/// <reference path="./sst-globals.d.ts" />

import { clientEnv, serverEnv, sstAwsRegion, Stage } from "@acme/env";

/**
 * Static Next.js (`next build` + `output: "export"`) → S3 + CloudFront via SST `StaticSite`.
 *
 * Run all SST commands from this package (cwd = `apps/web`).
 *
 * First-time setup: `pnpm sst:install` (here) or `pnpm sst:types` from repo root
 * Local: `pnpm sst:dev` (here) or root `pnpm sst:dev`
 * Deploy: set `NEXT_PUBLIC_*` then `pnpm sst:deploy -- --stage production`
 *
 * AWS region: default `DEFAULT_SST_AWS_REGION` in `@acme/env` unless `SST_AWS_REGION` is set.
 */
export default $config({
  app(input) {
    const localAwsProfile = serverEnv.SST_AWS_PROFILE?.trim();
    const region = sstAwsRegion();

    return {
      name: "web",
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
    new sst.aws.StaticSite("Web", {
      path: ".",
      errorPage: "/404.html",
      environment: {
        NEXT_PUBLIC_SITE_URL: clientEnv.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_API_URL: clientEnv.NEXT_PUBLIC_API_URL,
      },
      build: {
        command: "pnpm run build",
        output: "out",
      },
      dev: {
        command: "pnpm run dev",
        directory: ".",
        title: "web",
      },
    });
  },
});
