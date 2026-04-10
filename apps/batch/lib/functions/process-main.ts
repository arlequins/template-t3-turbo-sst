/**
 * Pipeline handler for `handlerKey` `process-main` (ETL, API call, …).
 * Registered in `config/handler.ts` (`HandlerMap`).
 */
import type { Handler } from "aws-lambda";

import type { HandlerInvokeEvent } from "..";
import { logStepPayload } from "../usecases/common/logging";
import { processMain } from "../usecases/process-main";

export type ProcessMainEvent = HandlerInvokeEvent<{ type: "raw" | "db-query" }>;

export const handler: Handler<
  ProcessMainEvent,
  { ok: true; detail?: string }
> = async (event) => {
  logStepPayload("ProcessMain", event.input);

  await processMain(event);

  return Promise.resolve({
    ok: true as const,
  });
};
