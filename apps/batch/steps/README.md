# Batches — overview

Batches are registered in **`RegisteredManifests`** in **`config/index.ts`**. Each entry is built with `createBatchManifest(batchId, stepDefs)`; `stepDefs` usually live in **`config/step-defs/<batch>.ts`**.

## Resources per batch

- **Step Functions** — runs `manifest.steps` in order; each step invokes the Lambda for its `handlerKey` via `HandlerMap` in `lib/index.ts`.
- **Cron (`CronV2`)** — `cron` / `enabled` from `ScheduleByStage[stage][batchId]` (stage from `resolveDeployStage()` in `@acme/env`).
- **Starter Lambda** — `shared/entry.ts`; uses env `STATE_MACHINE_ARN` to start that batch’s state machine.
- **Handler Lambdas** — one per `handlerKey` (reusable across batches) plus a shared failure Lambda at `lib/functions/common/pipeline-failure.ts`.
- **Failure path** — after retries, `Catch` → failure Lambda (`batchId`, Step Functions error context); wire alerts under `lib/usecases/pipeline-failure/`, then `PipelineFailureHandled`.

## Directory layout (summary)

```text
config/
  index.ts              # BatchScheduleId, ScheduleByStage, RegisteredManifests
  step-defs/
    sample.ts           # e.g. sampleSteps → passed to createBatchManifest
shared/
  index.ts              # types, createBatchManifest, BATCH_TASK_RETRY_POLICY
  entry.ts
lib/
  index.ts              # HandlerMap, HandlerInvokeEvent, HandlerKey
  functions/            # handler modules (includes common/ failure handler)
  usecases/
```

## Checklist: new batch

1. **`config/index.ts`**
   - Add a constant to `BatchScheduleId`.
   - Add a row for this batch under each stage in `ScheduleByStage` (`cron`, `enabled`).
2. **`config/step-defs/<batch>.ts`**
   - Export `BatchPipelineStep[]` (`stateName`, `handlerKey`, `useCase`, `withRetry`, optional `input`).
3. **`RegisteredManifests`**
   - Append `createBatchManifest(BatchScheduleId.XXX, xxxSteps)`.
4. **If you need a new handler**
   - Add `lib/functions/<name>.ts` with `export const handler`.
   - Add a **`handlerKey`** line to **`HandlerMap`** in **`lib/index.ts`**.
5. **`pnpm sst:deploy`** from **`apps/batch`**.

## Step fields

| Field        | Role                                                                                  |
| ------------ | ------------------------------------------------------------------------------------- |
| `stateName`  | Unique state name in the graph (PascalCase recommended).                              |
| `handlerKey` | `HandlerMap` key — which Lambda to invoke.                                            |
| `input`      | Optional. Defaults to `{% $states.input %}`. Use a JSONata string or a static object. |
| `withRetry`  | When `true`, applies `BATCH_TASK_RETRY_POLICY` (`shared/index.ts`).                   |

By default, the previous step’s output (or the execution input for the first step) flows through **`$states.input`**. Override per step with `input`.
