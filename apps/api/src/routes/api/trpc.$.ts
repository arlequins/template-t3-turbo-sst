import {
  AppRouter,
  createTRPCContext,
  TRPC_HTTP_PATH,
  TRPC_HTTP_ROUTE_SPLAT,
} from "@acme/trpc";
import { createFileRoute } from "@tanstack/react-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { corsPreflightResponse, withCors } from "~/server/cors";

export async function handleAppRouterTrpcRequest(
  req: Request,
): Promise<Response> {
  const res = await fetchRequestHandler({
    endpoint: TRPC_HTTP_PATH,
    router: AppRouter,
    req,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });
  return withCors(res);
}

export const Route = createFileRoute(TRPC_HTTP_ROUTE_SPLAT)({
  server: {
    handlers: {
      GET: ({ request }) => handleAppRouterTrpcRequest(request),
      POST: ({ request }) => handleAppRouterTrpcRequest(request),
      OPTIONS: ({ request }) => corsPreflightResponse(request),
    },
  },
});
