/**
 * tRPC HTTP batch endpoint (leading slash, no trailing slash).
 * Keep in sync with TanStack Router `routes/api/trpc.$.ts`.
 */
export const TRPC_HTTP_PATH = "/api/trpc";

/**
 * TanStack Router file-route path for the tRPC splat handler.
 * Must match the `routes/api/` folder layout (`trpc.$.ts` → `/api/trpc/$`).
 */
export const TRPC_HTTP_ROUTE_SPLAT = "/api/trpc/$" as const;
