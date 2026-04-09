import type { Handler } from "aws-lambda";

import type { HandlerInvokeEvent } from "..";
import { logStepPayload } from "../usecases/common/logging";

/**
 * `handlerKey` `process-main` — primary batch work (ETL, API call, …).
 */
export const handler: Handler<
  HandlerInvokeEvent,
  { ok: true; detail?: string }
> = (event) => {
  logStepPayload("ProcessMain", event.input);
  return Promise.resolve({
    ok: true as const,
    detail: "replace-with-real-work",
  });
};
