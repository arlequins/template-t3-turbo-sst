# `apps/batch` — Step Functions + EventBridge cron

Runs **batch pipelines** as sequential AWS Step Functions Lambdas, optionally on a schedule via **EventBridge** (SST `CronV2`).

## Scripts

| Script            | Description                                |
| ----------------- | ------------------------------------------ |
| `pnpm sst:dev`    | Local SST dev (root `.env` via `with-env`) |
| `pnpm sst:deploy` | Deploy                                     |
| `pnpm sst:remove` | Remove stack                               |

Always run commands from **`apps/batch`** (`package.json` `with-env` loads the repo-root `.env`).

## Layout

| Path                  | Role                                                          |
| --------------------- | ------------------------------------------------------------- |
| `sst.config.ts`       | Step Functions + Lambdas + optional Cron per registered batch |
| `config/constants.ts` | Stage-specific cron / EventBridge on-off (`@acme/env`)        |
| `config/registry.ts`  | Batches to deploy (`REGISTERED_BATCHES`)                      |
| `lib/`                | `HandlerMap` (handler paths), `functions/*.ts`, `usecases/`   |
| `shared/`             | `createBatchManifest`, retry policy, cron `entry.ts`          |
| `steps/<batchId>/`    | Per-batch manifest (`manifest.ts`)                            |

For adding batches, see **[`steps/README.md`](./steps/README.md)**. Reference: **`steps/sample/`**.
