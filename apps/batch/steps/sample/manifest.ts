import type { BatchManifest, BatchPipelineStep } from "../types";
import { EVENTBRIDGE_ENABLED, SCHEDULE } from "../../config/constants";
import { createBatchManifest } from "../../shared";

const BATCH_NAME = "sample";

const STEPS: BatchPipelineStep[] = [
  {
    stateName: "LogStart",
    handlerKey: "log-batch-start",
    useCase:
      "First step: RUNNING / audit / idempotency (like a “logger running” task).",
    withRetry: false,
    input: "{% $states.input %}",
  },
  {
    stateName: "ProcessMain",
    handlerKey: "process-main",
    useCase:
      "Main work for this batch. Add a handler file and register `handlerKey` in `lib/index.ts` (HandlerMap).",
    withRetry: true,
    input: {
      type: "query",
    },
  },
];

/**
 * Example batch: one Step Functions workflow + one Cron schedule.
 * Copy the `${BATCH_NAME}/` folder to add another batch; register the manifest in `steps/registry.ts`.
 */
export const sample = createBatchManifest(
  BATCH_NAME,
  SCHEDULE[BATCH_NAME as keyof typeof SCHEDULE],
  EVENTBRIDGE_ENABLED[BATCH_NAME as keyof typeof EVENTBRIDGE_ENABLED],
  STEPS,
) satisfies BatchManifest;
