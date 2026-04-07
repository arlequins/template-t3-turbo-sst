/**
 * Browser-safe entry: HTTP constants + router types only.
 * Do not import `@acme/trpc` from Client Components — it pulls server code (`postgres`, etc.).
 */
export { TRPC_HTTP_PATH, TRPC_HTTP_ROUTE_SPLAT } from "./constants";
export type { AppRouter, RouterInputs, RouterOutputs } from "./types";
