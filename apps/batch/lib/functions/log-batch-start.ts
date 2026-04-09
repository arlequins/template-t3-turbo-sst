import type { Handler } from "aws-lambda";

import type { HandlerInvokeEvent } from "..";
import { logStepPayload } from "../usecases/common/logging";

/**
 * `handlerKey` `log-batch-start` — first touch of the execution (RUNNING / audit / idempotency, etc.).
 */
export const handler: Handler<
  HandlerInvokeEvent,
  { phase: "running"; received: unknown }
> = (event) => {
  logStepPayload("LogBatchStart", event.input);
  return Promise.resolve({
    phase: "running" as const,
    received: event.input,
  });
};
