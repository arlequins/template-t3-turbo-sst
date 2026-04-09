import type { Handler } from "aws-lambda";

/**
 * One folder = one Lambda step. Rename `example-step` and register in `manifest.ts`.
 */
export const handler: Handler<unknown, { ok: true }> = (event) => {
  console.log("[example-step]", JSON.stringify(event));
  return Promise.resolve({ ok: true });
};
