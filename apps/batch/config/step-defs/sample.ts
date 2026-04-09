import type { BatchPipelineStep } from "../../shared";

export const sampleSteps: BatchPipelineStep[] = [
  {
    stateName: "LogStart",
    handlerKey: "log-batch-start",
    useCase:
      "First step: RUNNING / audit / idempotency (like a “logger running” task).",
    withRetry: false,
    input: "{% $states.input %}",
  },
  {
    stateName: "ProcessMain",
    handlerKey: "process-main",
    useCase:
      "Main work for this batch. Add a handler file and register `handlerKey` in `lib/index.ts` (HandlerMap).",
    withRetry: true,
    input: {
      type: "query",
    },
  },
];
