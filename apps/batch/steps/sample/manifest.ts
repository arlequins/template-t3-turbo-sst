import type { BatchManifest } from "../types";
import { EVENTBRIDGE_ENABLED, SCHEDULE } from "../../config/constants";
import { createBatchManifest } from "../../shared";

const BATCH_NAME = "sample";

const STEPS = [
  {
    stateName: "LogStart",
    handler: "log-batch-start.handler.ts",
    useCase:
      "First step: RUNNING / audit / idempotency (like a “logger running” task).",
    withRetry: false,
  },
  {
    stateName: "ProcessMain",
    handler: `process-main.handler.ts`,
    useCase:
      "Main work for this batch. Add more steps as sibling folders + rows here.",
    withRetry: true,
  },
];

/**
 * Example batch: one Step Functions workflow + one Cron schedule.
 * Copy the `${BATCH_NAME}/` folder to add another batch, register it in `steps/registry.ts`.
 */
export const sample = createBatchManifest(
  BATCH_NAME,
  SCHEDULE[BATCH_NAME as keyof typeof SCHEDULE],
  EVENTBRIDGE_ENABLED[BATCH_NAME as keyof typeof EVENTBRIDGE_ENABLED],
  STEPS,
) satisfies BatchManifest;
