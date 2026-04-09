# Template

Reference when adding batches. Same flow as **[`steps/README.md`](../README.md)**.

## Summary

| Step | Action                                                                          |
| ---- | ------------------------------------------------------------------------------- |
| 1    | `config/index.ts`: extend `BatchScheduleId` and `ScheduleByStage` for the batch |
| 2    | `config/step-defs/<batch>.ts`: define `BatchPipelineStep[]`                     |
| 3    | Register `createBatchManifest(...)` in `RegisteredManifests`                    |
| 4    | If needed: `lib/functions/*.ts` + `lib/index.ts` (`HandlerMap`)                 |

Align `BatchScheduleId` values and `step-defs` file names / exports with your team conventions.
