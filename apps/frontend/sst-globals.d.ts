/**
 * SST loads real globals from `.sst/platform/config.d.ts` after `pnpm sst:install`.
 * This file keeps `sst.config.ts` typechecking in a fresh clone before that step.
 */
declare const $config: (config: {
  app: (input?: { stage?: string }) => {
    name: string;
    removal: string;
    protect: boolean;
    home: string;
    providers?: {
      aws?: { profile?: string; region?: string } | string | boolean;
    };
  };
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
