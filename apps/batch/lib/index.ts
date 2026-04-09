/** Passed from Step Functions `lambdaInvoke.payload` for every pipeline handler Lambda. */
export type HandlerInvokeEvent = {
  batchId: string;
  /** This batch’s `stateName` for the current step. */
  stateName: string;
  /** Previous step output or `StartExecution` input. */
  input: unknown;
};

/**
 * One SST `Function` per **handler** (`handlerKey`). Multiple batches / steps can share the same key.
 * Add a row when you introduce a new entrypoint under `lib/functions/` (export `handler`).
 *
 * Paths are relative to the `apps/batch` package root.
 */
export const HandlerMap = {
  "log-batch-start": "lib/functions/log-batch-start.ts",
  "process-main": "lib/functions/process-main.ts",
} as const;

export type HandlerMap = (typeof HandlerMap)[keyof typeof HandlerMap];

export type HandlerKey = keyof typeof HandlerMap;
