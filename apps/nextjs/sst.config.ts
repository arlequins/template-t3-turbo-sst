/// <reference path="./sst-globals.d.ts" />

/**
 * Static Next.js (`next build` + `output: "export"`) → S3 + CloudFront via SST `StaticSite`.
 *
 * Run all SST commands from this package (cwd = `apps/nextjs`).
 *
 * First-time setup: `pnpm sst:install` (here) or `pnpm sst:types` from repo root
 * Local: `pnpm sst:dev` (here) or root `pnpm sst:dev`
 * Deploy: set `NEXT_PUBLIC_*` then `pnpm sst:deploy -- --stage production`
 */
export default $config({
  app(input) {
    // Local machines only: set `SST_AWS_PROFILE` in shell or `apps/nextjs/.env` (do not set in CI/prod).
    const localAwsProfile = process.env.SST_AWS_PROFILE?.trim();

    return {
      name: "template-t3-turbo-sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: input?.stage === "production",
      home: "aws",
      ...(localAwsProfile
        ? { providers: { aws: { profile: localAwsProfile } } }
        : {}),
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
