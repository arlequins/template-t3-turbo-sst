import type { Handler } from "aws-lambda";

/**
 * Use case: first touch of the execution — log RUNNING, audit row, idempotency key.
 */
export const handler: Handler<
  unknown,
  { phase: "running"; received: unknown }
> = (event) => {
  console.log("[LogBatchStart]", JSON.stringify({ event }));
  return Promise.resolve({ phase: "running", received: event });
};
