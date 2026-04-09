# Batches (one Step Functions app per folder)

Each **batch** is:

- **One** Step Functions state machine (`sst.aws.StepFunctions`) — sequential Lambda steps.
- **One** schedule (`CronV2`) — set in that batch’s `constants.ts` (`BATCH_SCHEDULE`).
- **One** starter Lambda (`start-execution.handler.ts`) that calls `StartExecution` using `STATE_MACHINE_ARN` from the Function environment (set in root `sst.config.ts` together with `states:StartExecution`).

Copy `default/` to e.g. `nightly-sync/`, adjust `manifest.ts` + `constants.ts`, register in `registry.ts`, then redeploy.

## Layout

```text
steps/
  registry.ts          # list of manifests
  types.ts             # shared types
  default/
    constants.ts       # schedule for this batch only
    manifest.ts        # pipeline name, cron name, steps (order = execution order)
    start-execution.handler.ts
    steps/
      log-batch-start/
        handler.ts
      process-main/
        handler.ts
  _template/           # copy-paste starter (optional)
```

## Add a new batch

1. Copy `default/` → `my-batch/`.
2. Edit `my-batch/constants.ts` (cron/rate for **this** batch).
3. Edit `my-batch/manifest.ts`: unique `id`, `pipelineComponentName`, `cronComponentName`, `steps`, `starterHandler` path.
4. Copy `start-execution.handler.ts` if you need different input to `StartExecution`; otherwise reuse the same file (ARN is injected per batch in `sst.config.ts`).
5. Put each step in `steps/<folder>/handler.ts`; list them in `manifest.steps` in order.
6. `import { myBatch } from "./my-batch/manifest"` and append to `REGISTERED_BATCHES` in `registry.ts`.
7. `pnpm sst:deploy` from `apps/batch`.

## Shared retry

`withRetry: true` uses `shared/retry-policy.ts` for all steps.
