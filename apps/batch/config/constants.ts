/**
 * Cron schedules per deploy stage (`SST_STAGE`). Stage keys come from `@acme/env`.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html
 */

import type { DeployStage } from "@acme/env";
import { resolveDeployStage } from "@acme/env";

/** Extend this union when you add a new batch with rows in `SCHEDULE_BY_STAGE` / `EVENTBRIDGE_SCHEDULE_ENABLED_BY_STAGE`. */
export type BatchScheduleId = "sample";

/**
 * Per-stage cron/rate per batch id (`sample`, …). Add a column when you add a batch folder.
 */
export const SCHEDULE_BY_STAGE: Record<
  DeployStage,
  Record<BatchScheduleId, { cron: string; enabled: boolean }>
> = {
  production: {
    sample: {
      cron: "cron(0 2 * * ? *)",
      enabled: true,
    },
  },
  develop: {
    sample: {
      cron: "cron(0 2 * * ? *)",
      enabled: true,
    },
  },
  offline: {
    sample: {
      cron: "cron(0 2 * * ? *)",
      enabled: false,
    },
  },
  test: {
    sample: {
      cron: "cron(0 2 * * ? *)",
      enabled: false,
    },
  },
};

/**
 * Cron expression for one batch id for the **current** resolved deploy stage.
 */
export function scheduleForBatch(batchId: BatchScheduleId): string {
  const stage = resolveDeployStage();
  return SCHEDULE_BY_STAGE[stage][batchId].cron;
}

/**
 * Whether EventBridge-backed cron is deployed for this batch id for the **current** stage.
 */
export function eventBridgeEnabledForBatch(batchId: BatchScheduleId): boolean {
  const stage = resolveDeployStage();
  return SCHEDULE_BY_STAGE[stage][batchId].enabled;
}

/**
 * Convenience map for manifests: `SCHEDULE.sample` reads the value for the current stage.
 * Prefer `scheduleForBatch("sample")` when passing `BATCH_NAME` dynamically.
 */
export const SCHEDULE: Record<BatchScheduleId, string> = {
  get sample() {
    return scheduleForBatch("sample");
  },
} as Record<BatchScheduleId, string>;

/**
 * Convenience map for manifests: `EVENTBRIDGE_ENABLED.sample` matches the current stage row.
 */
export const EVENTBRIDGE_ENABLED: Record<BatchScheduleId, boolean> = {
  get sample() {
    return eventBridgeEnabledForBatch("sample");
  },
} as Record<BatchScheduleId, boolean>;
