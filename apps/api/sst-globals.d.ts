/**
 * SST loads real globals from `.sst/platform/config.d.ts` after `pnpm sst:install`.
 * This file keeps `sst.config.ts` typechecking in a fresh clone before that step.
 */

/** Available inside `$config` `run()` — app id from `app()` and active stage (e.g. `pnpm sst deploy --stage`). */
declare const $app: {
  name: string;
  stage: string;
};

type SstAppConfig = {
  name: string;
  removal: string;
  protect: boolean;
  home: string;
  providers?: {
    aws?: { profile?: string; region?: string } | string | boolean;
  };
};

declare const $config: (config: {
  app: (input?: { stage?: string }) => SstAppConfig | Promise<SstAppConfig>;
  run: () => Record<string, unknown> | Promise<Record<string, unknown>>;
}) => unknown;

declare const sst: {
  aws: {
    Function: new (
      name: string,
      args: {
        handler: string;
        environment?: Record<string, string>;
        url?: boolean;
        vpc?: {
          subnets: string[];
          securityGroups: string[];
        };
        link?: unknown[];
      } & Record<string, unknown>,
    ) => { url: string };
  };
};
