# `shared/` — types, manifest factory, cron entry

| Path       | Purpose                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| `index.ts` | `BatchManifest`, `BatchPipelineStep`, `createBatchManifest`, `BATCH_TASK_RETRY_POLICY`               |
| `entry.ts` | **`StartExecution`** handler for scheduled batches (`STATE_MACHINE_ARN` injected in `sst.config.ts`) |

Step definitions, schedules, and the manifest list live under **`config/`** (`config/step-defs/`, `config/index.ts`).  
Register handler file paths only in **`lib/index.ts`** (`HandlerMap`).
