/**
 * One **batch** = one Step Functions state machine + its own schedule + starter Lambda.
 * Steps run in array order inside that state machine.
 */
export type BatchPipelineStep = {
  /** Unique among steps in this batch (used in SST `Function` name). */
  functionId: string;
  /** State name in the graph (PascalCase, unique in this batch). */
  stateName: string;
  /** Path from `apps/batch` root, e.g. `steps/foo/steps/bar/handler.ts`. */
  handler: string;
  /** Human-readable use case (not deployed). */
  useCase: string;
  withRetry?: boolean;
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
