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
    TanStackStart: new (
      name: string,
      args?: {
        path?: string;
        buildCommand?: string;
        environment?: Record<string, string>;
        domain?: string | Record<string, unknown>;
        link?: unknown[];
        dev?:
          | false
          | {
              autostart?: boolean;
              command?: string;
              directory?: string;
              title?: string;
              url?: string;
            };
      } & Record<string, unknown>,
    ) => unknown;
  };
};
