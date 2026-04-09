/// <reference path="./sst-globals.d.ts" />

import { serverEnv, Stage } from "@acme/env";

/**
 * Bootstrap app: no deployed resources. Aligns AWS provider (profile/region) with web/api.
 * `pnpm env:pull` / `env:push`: Secrets Manager — `pull-secret-env.mjs` / `push-secret-env.mjs` + `scripts/lib/shared.mjs`.
 * Optional: `pnpm --filter @acme/sst-bootstrap sst:install` for SST platform types.
 */
export default $config({
  app(input) {
    const localAwsProfile = serverEnv.SST_AWS_PROFILE?.trim();
    const region = serverEnv.SST_AWS_REGION!;

    return {
      name: "bootstrap",
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
    // No infrastructure — use `pnpm env:pull` for SSM → repo root `.env`.
  },
});
