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

type SfnState = {
  next: (other: SfnState) => SfnState;
};

/** Task from `lambdaInvoke`: supports `retry` then `next` (success path). */
type SfnTaskState = SfnState & {
  retry: (args: Record<string, unknown>) => SfnTaskState;
};

type StepFunctionsCtor = new (
  name: string,
  args: {
    definition: SfnState;
    type?: "standard" | "express";
    logging?: unknown;
  },
) => { arn: unknown };

type StepFunctionsStatics = {
  pass: (args: { name: string }) => SfnState;
  succeed: (args: { name: string }) => SfnState;
  lambdaInvoke: (args: { name: string; function: unknown }) => SfnTaskState;
};

declare const sst: {
  aws: {
    Function: new (name: string, args?: Record<string, unknown>) => unknown;
    CronV2: new (name: string, args?: Record<string, unknown>) => unknown;
    StepFunctions: StepFunctionsCtor & StepFunctionsStatics;
  };
};
