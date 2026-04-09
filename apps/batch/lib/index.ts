/** Passed from Step Functions `lambdaInvoke.payload` for every pipeline handler Lambda. */
export type HandlerInvokeEvent<T = unknown> = {
  batchId: string;
  /** This batch’s `stateName` for the current step. */
  stateName: string;
  /** Previous step output or `StartExecution` input. */
  input: T;
};

/**
 * Maps `handlerKey` (from `BatchPipelineStep` / `config/step-defs`) to Lambda handler paths.
 * One deploy-time `Function` per key; multiple batches may reference the same key.
 *
 * Paths are relative to the `apps/batch` package root; each module must `export const handler`.
 */
export const HandlerMap = {
  "log-batch-start": "lib/functions/log-batch-start.ts",
  "process-main": "lib/functions/process-main.ts",
} as const;

export type HandlerMap = (typeof HandlerMap)[keyof typeof HandlerMap];

export type HandlerKey = keyof typeof HandlerMap;
