// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

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
    return {
      name: "template-t3-turbo-sst",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
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
