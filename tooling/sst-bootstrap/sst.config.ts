/// <reference path="./sst-globals.d.ts" />

/**
 * Bootstrap app: no deployed resources. Aligns AWS provider (profile/region) with web/api.
 * `pnpm env:pull` / `env:push`: Secrets Manager — `pull-secret-env.mjs` / `push-secret-env.mjs` + `scripts/lib/shared.mjs`.
 * Optional: `pnpm --filter @acme/sst-bootstrap sst:install` for SST platform types.
 */
export default $config({
  app(input) {
    const localAwsProfile = process.env.SST_AWS_PROFILE?.trim();
    const region = process.env.SST_AWS_REGION?.trim() ?? "us-east-1";

    return {
      name: "bootstrap",
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
    // No infrastructure — use `pnpm env:pull` for SSM → repo root `.env`.
  },
});
