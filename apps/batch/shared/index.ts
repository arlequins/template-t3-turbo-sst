import type { HandlerKey } from "../lib";
import type { BatchManifest } from "../steps/types";

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

/**
 * Example batch: one Step Functions workflow + one Cron schedule.
 * Copy the `${BATCH_NAME}/` folder to add another batch, register it in `steps/registry.ts`.
 */
export const createBatchManifest = (
  name: string,
  schedule: string,
  eventBridgeScheduleEnabled: boolean,
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
    schedule,
    eventBridgeScheduleEnabled,
    starterHandler: `shared/entry.ts`,
    steps: stepDefs.map((stepDef) => ({
      stateName: stepDef.stateName,
      handlerKey: stepDef.handlerKey,
      useCase: stepDef.useCase,
      withRetry: stepDef.withRetry,
      ...(stepDef.input !== undefined ? { input: stepDef.input } : {}),
    })),
  }) satisfies BatchManifest;
