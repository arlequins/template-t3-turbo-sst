# Batches (`steps/<batchId>/`)

Each **batch** has:

- **One** Step Functions state machine — `manifest.steps` order; each step calls the Lambda for its **`handlerKey`** (see `lib/index.ts` → `HandlerMap`).
- **One** EventBridge schedule (`CronV2`) — stage-specific cron + `enabled` in `config/constants.ts` (if disabled, only the state machine remains; use manual `StartExecution`).
- **One** shared cron starter — `shared/entry.ts` (`STATE_MACHINE_ARN` from `sst.config.ts`).
- **Handler Lambdas** — one deploy-time `Function` per **`handlerKey`** in `HandlerMap` (sample: `log-batch-start`, `process-main` → 2 Lambdas), plus **one** shared failure Lambda (`lib/functions/common/pipeline-failure.ts`).
- **Failure path** — after retries, `Catch` invokes the failure Lambda with `batchId` and Step Functions error context; implement alerts in `lib/usecases/pipeline-failure/`, then `PipelineFailureHandled`.

Reference: **`sample/`**.

## Layout

```text
steps/
  registry.ts              # REGISTERED_BATCHES
  types.ts                 # BatchManifest, BatchPipelineStep
  sample/
    manifest.ts            # createBatchManifest, SCHEDULE / EVENTBRIDGE_ENABLED
  _template/
config/
  constants.ts
  registry.ts
shared/
  index.ts                 # createBatchManifest, BATCH_TASK_RETRY_POLICY
  entry.ts
lib/
  index.ts                 # HandlerMap, HandlerInvokeEvent, HandlerKey
  functions/               # pipeline + failure entrypoints (paths in HandlerMap)
  usecases/                # logging, pipeline-failure alert helpers
```

## Checklist: new batch

1. Copy **`sample/`** → `steps/<batchId>/`.
2. **`config/constants.ts`** — add `BatchScheduleId`, `SCHEDULE_BY_STAGE` column, `SCHEDULE` / `EVENTBRIDGE_ENABLED` getters.
3. **`steps/<batchId>/manifest.ts`** — `BATCH_NAME`, `STEPS` (`stateName`, `handlerKey`, `useCase`, `withRetry`, optional `input`), `createBatchManifest(...)`.
4. **New handler?** Add `lib/functions/<name>.ts` (export `handler`) and a **`handlerKey`** entry in **`lib/index.ts`** (`HandlerMap`).
5. **`steps/registry.ts`** — import the manifest and append to `REGISTERED_BATCHES`.
6. **`pnpm sst:deploy`** from **`apps/batch`**.

## Step fields

| Field        | Role                                                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `stateName`  | Unique state name in the graph (PascalCase).                                                                            |
| `handlerKey` | Key in `HandlerMap` — picks which Lambda runs.                                                                          |
| `input`      | Optional. Sets `lambdaInvoke.payload.input`. Default is `{% $states.input %}`. Use a JSONata string or a static object. |
| `withRetry`  | Uses `BATCH_TASK_RETRY_POLICY` from `shared/index.ts`.                                                                  |

The previous step’s output (or the execution input for the first step) flows through **`$states.input`** unless you override **`input`** on that step.
