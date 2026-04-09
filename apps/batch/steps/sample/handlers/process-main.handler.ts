import type { Handler } from "aws-lambda";

/**
 * Use case: primary work for this step (ETL, API call, …).
 */
export const handler: Handler<unknown, { ok: true; detail?: string }> = (
  event,
) => {
  console.log("[ProcessMain]", JSON.stringify(event));
  return Promise.resolve({ ok: true, detail: "replace-with-real-work" });
};
