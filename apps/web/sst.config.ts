/// <reference path="./sst-globals.d.ts" />

/**
 * Static Next.js (`next build` + `output: "export"`) → S3 + CloudFront via SST `StaticSite`.
 *
 * Run all SST commands from this package (cwd = `apps/web`).
 *
 * First-time setup: `pnpm sst:install` (here) or `pnpm sst:types` from repo root
 * Local: `pnpm sst:dev` (here) or root `pnpm sst:dev`
 * Deploy: set `NEXT_PUBLIC_*` then `pnpm sst:deploy -- --stage production`
 *
 * AWS: default region Tokyo (`ap-northeast-1`) for S3/StaticSite. Override with `SST_AWS_REGION`.
 */
export default $config({
  app(input) {
    const localAwsProfile = process.env.SST_AWS_PROFILE?.trim();
    const region = process.env.SST_AWS_REGION?.trim() ?? "us-east-1";

    return {
      name: "web",
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
    new sst.aws.StaticSite("Web", {
      path: ".",
      errorPage: "/404.html",
      environment: {
        NEXT_PUBLIC_SITE_URL:
          process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        NEXT_PUBLIC_API_URL:
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
      },
      build: {
        command: "pnpm run build",
        output: "out",
      },
      dev: {
        command: "pnpm run dev",
        directory: ".",
        title: "nextjs",
      },
    });
  },
});
