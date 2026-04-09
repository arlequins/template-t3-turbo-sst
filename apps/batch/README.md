# `apps/batch` — Step Functions + EventBridge cron

Runs **batch pipelines** as sequential **Step Functions**, optionally on a schedule via **EventBridge** (`CronV2`).

## Scripts

| Script            | Description                                                                         |
| ----------------- | ----------------------------------------------------------------------------------- |
| `pnpm run`        | Interactive local step runner (optional `-- --batch <id>`, `-- --step <stateName>`) |
| `pnpm sst:dev`    | Local SST dev (root `.env` via `with-env`)                                          |
| `pnpm sst:deploy` | Deploy                                                                              |
| `pnpm sst:remove` | Remove stack                                                                        |

Run commands from **`apps/batch`** (`package.json` `with-env` loads the repo-root `.env`).

## Layout

| Path                | Role                                                                          |
| ------------------- | ----------------------------------------------------------------------------- |
| `sst.config.ts`     | Wires Step Functions, Lambdas, and Cron from `RegisteredManifests`            |
| `config/index.ts`   | `BatchScheduleId`, per-stage `ScheduleByStage`, `RegisteredManifests`         |
| `config/step-defs/` | Per-batch step arrays (`BatchPipelineStep[]`) passed to `createBatchManifest` |
| `shared/index.ts`   | `BatchManifest` / `BatchPipelineStep`, `createBatchManifest`, retry policy    |
| `shared/entry.ts`   | Cron → `StartExecution` (`STATE_MACHINE_ARN`)                                 |
| `lib/index.ts`      | `HandlerMap` — handler file paths (`handlerKey` → Lambda)                     |
| `lib/functions/`    | Pipeline and failure Lambdas (`export const handler`)                         |
| `lib/usecases/`     | Shared logging, failure alerting, etc.                                        |

See **[`steps/README.md`](./steps/README.md)** for how to add batches.
