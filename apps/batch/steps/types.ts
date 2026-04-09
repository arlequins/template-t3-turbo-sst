import type { HandlerKey } from "../lib";

/**
 * One **batch** = one Step Functions state machine + its own schedule + starter Lambda.
 * Steps run in array order inside that state machine.
 */
export type BatchPipelineStep = {
  /** State name in the graph (PascalCase, unique in this batch). */
  stateName: string;
  /**
   * Selects the handler Lambda — must exist as a key in `lib/index.ts` (`HandlerMap`).
   * The same key can be reused across batches or steps.
   */
  handlerKey: HandlerKey;
  /** Human-readable description (not deployed). */
  useCase: string;
  withRetry?: boolean;
  /**
   * `lambdaInvoke.payload.input` for this step. Omit to use `{% $states.input %}` (chain input).
   * Set to a JSONata string or a static object; see `pipelineStepPayloadInput` in `sst.config.ts`.
   */
  input?: unknown;
};

export type BatchManifest = {
  /** Short key for logs and stable prefixes (e.g. `default`, `nightly-sync`). */
  id: string;
  /** `new sst.aws.StepFunctions("<this>", …)`. Cron passes its ARN via `STATE_MACHINE_ARN`. */
  pipelineComponentName: string;
  /** `new sst.aws.CronV2("<this>", …)`. */
  cronComponentName: string;
  /** EventBridge schedule for this batch only (`rate(...)` / `cron(...)`). */
  schedule: string;
  /** When `false`, `CronV2` is not deployed (Step Functions + manual `StartExecution` still available). */
  eventBridgeScheduleEnabled: boolean;
  /** Lambda that calls `StartExecution` on this batch’s state machine. */
  starterHandler: string;
  steps: BatchPipelineStep[];
};
