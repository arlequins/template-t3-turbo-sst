/**
 * Cron schedules per deploy stage (`SST_STAGE`). Stage keys come from `@acme/env`.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html
 */

import type { DeployStage } from "@acme/env";

import type { BatchManifest } from "../shared";
import { createBatchManifest } from "../shared";
import { sampleSteps } from "./step-defs/sample";

export type BatchScheduleId =
  (typeof BatchScheduleId)[keyof typeof BatchScheduleId];

/** Extend this union when you add a new batch with rows in `SCHEDULE_BY_STAGE` / `EVENTBRIDGE_SCHEDULE_ENABLED_BY_STAGE`. */
export const BatchScheduleId = {
  SAMPLE: "sample",
} as const;

/** Every batch here gets its own Step Functions + Cron + starter Lambda. Order does not matter. */
export const RegisteredManifests: BatchManifest[] = [
  createBatchManifest(BatchScheduleId.SAMPLE, sampleSteps),
];

/**
 * Per-stage cron/rate per batch id (`sample`, …). Add a column when you add a batch folder.
 */
export const ScheduleByStage: Record<
  DeployStage,
  Record<BatchScheduleId, { cron: string; enabled: boolean }>
> = {
  production: {
    [BatchScheduleId.SAMPLE]: {
      cron: "cron(0 2 * * ? *)",
      enabled: true,
    },
  },
  develop: {
    [BatchScheduleId.SAMPLE]: {
      cron: "cron(0 2 * * ? *)",
      enabled: true,
    },
  },
  offline: {
    [BatchScheduleId.SAMPLE]: {
      cron: "cron(0 2 * * ? *)",
      enabled: false,
    },
  },
  test: {
    [BatchScheduleId.SAMPLE]: {
      cron: "cron(0 2 * * ? *)",
      enabled: false,
    },
  },
};
