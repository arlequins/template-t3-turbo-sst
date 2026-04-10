/**
 * SST loads real globals from `.sst/platform/config.d.ts` after `pnpm sst:install`.
 * This file keeps `sst.config.ts` typechecking in a fresh clone before that step.
 */
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
  run: () => void | Promise<void>;
}) => unknown;

declare const sst: {
  aws: {
    StaticSite: new (
      name: string,
      args: {
        path: string;
        errorPage?: string;
        environment?: Record<string, string>;
        build?: { command: string; output: string };
        dev?: { command: string; directory: string; title?: string };
      },
    ) => unknown;
  };
};
