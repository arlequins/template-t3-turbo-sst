import type { Handler } from "aws-lambda";

import { notifyPipelineFailureAlert } from "../../usecases/pipeline-failure";

export type PipelineFailureHandlerEvent = {
  batchId: string;
  /** Catch-branch input from Step Functions (`Error`, `Cause`, …). */
  stepFunctionsInput?: unknown;
};

function requireBatchId(event: PipelineFailureHandlerEvent): string {
  const id = typeof event.batchId === "string" ? event.batchId.trim() : "";
  if (!id) {
    throw new Error(
      "batchId is required in the event (set in sst.config.ts `lambdaInvoke.payload`)",
    );
  }
  return id;
}

/**
 * Shared Step Functions **Catch** target: any step failure (after retries) routes here.
 * `batchId` is injected per pipeline in `sst.config.ts`; `stepFunctionsInput` is the catcher input.
 */
export const handler: Handler<PipelineFailureHandlerEvent> = (event) => {
  notifyPipelineFailureAlert({
    batchId: requireBatchId(event),
    errorEvent: event.stepFunctionsInput ?? event,
  });
};
