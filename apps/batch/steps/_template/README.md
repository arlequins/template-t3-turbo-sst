# Template (`_template/`)

When creating a batch **from scratch**:

1. Copy **`steps/sample/`** → `steps/<batchId>/`, then edit `manifest.ts` and `config/constants.ts`.
2. Or follow **[`steps/README.md`](../README.md)** and mirror `sample/manifest.ts`.

## Checklist

| Step | Action                                                                                                       |
| ---- | ------------------------------------------------------------------------------------------------------------ |
| 1    | `config/constants.ts`: `BatchScheduleId`, `SCHEDULE_BY_STAGE`, `SCHEDULE` / `EVENTBRIDGE_ENABLED`            |
| 2    | `steps/<batchId>/manifest.ts`: `createBatchManifest` (imports from `../../shared`, `../../config/constants`) |
| 3    | New pipeline handler: `lib/functions/<name>.ts` + **`handlerKey`** in **`lib/index.ts`** (`HandlerMap`)      |
| 4    | `steps/registry.ts`: register the batch                                                                      |

`<batchId>` must match `BATCH_NAME` and schedule keys in `config`.
