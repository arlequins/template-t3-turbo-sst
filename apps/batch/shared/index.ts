import { resolveDeployStage } from "@acme/env";

import type { BatchScheduleId } from "../config";
import type { HandlerKey } from "../lib";
import { ScheduleByStage } from "../config";

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
  id: BatchScheduleId;
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

/**
 * Shared Step Functions task retry for any batch step with `withRetry: true`.
 *
 * @see https://sst.dev/docs/component/aws/step-functions/state/#retryargs
 */
export const BATCH_TASK_RETRY_POLICY = {
  errors: ["States.ALL"],
  maxAttempts: 3,
  interval: "5 seconds",
  backoffRate: 2,
} as const;

const stage = resolveDeployStage();

/**
 * Builds a `BatchManifest`: schedule/enabled come from `ScheduleByStage` in `config/index.ts`
 * for the current deploy stage (`resolveDeployStage()`).
 *
 * Wire new batches by adding `step-defs`, extending `ScheduleByStage` / `BatchScheduleId`,
 * and appending to `RegisteredManifests` in `config/index.ts`.
 */
export const createBatchManifest = (
  name: BatchScheduleId,
  stepDefs: {
    stateName: string;
    handlerKey: HandlerKey;
    useCase: string;
    withRetry?: boolean;
    /**
     * Passed to `lambdaInvoke.payload.input` (JSONata string or static object).
     * Omit to default to `{% $states.input %}` in `sst.config.ts`.
     */
    input?: unknown;
  }[],
) =>
  ({
    id: name,
    pipelineComponentName: `${name}Pipeline`,
    cronComponentName: `${name}Schedule`,
    schedule: ScheduleByStage[stage][name].cron,
    eventBridgeScheduleEnabled: ScheduleByStage[stage][name].enabled,
    starterHandler: `shared/entry.ts`,
    steps: stepDefs.map((stepDef) => ({
      stateName: stepDef.stateName,
      handlerKey: stepDef.handlerKey,
      useCase: stepDef.useCase,
      withRetry: stepDef.withRetry,
      ...(stepDef.input !== undefined ? { input: stepDef.input } : {}),
    })),
  }) satisfies BatchManifest;
