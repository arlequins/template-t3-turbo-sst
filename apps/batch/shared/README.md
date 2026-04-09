# `shared/` — batch manifests and cron entry

Batch **definitions** live under `steps/<batchId>/manifest.ts`. Handler Lambdas and domain code are under **`../lib/`** (`functions/`, `usecases/`).

| Path       | Purpose                                                                     |
| ---------- | --------------------------------------------------------------------------- |
| `index.ts` | `createBatchManifest`, Step Functions **retry** (`BATCH_TASK_RETRY_POLICY`) |
| `entry.ts` | Cron → **`StartExecution`** (`STATE_MACHINE_ARN` from `sst.config.ts`)      |

Register handler file paths in **`lib/index.ts`** (`HandlerMap`), not here.
