import { clientEnv, serverEnv } from "@acme/env";
import { AppRouter, createTRPCContext, TRPC_HTTP_PATH } from "@acme/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";

export type ApiBindings = {
  Variables: {
    requestId: string;
  };
};

export type CreateApiAppOptions = {
  corsOrigins?: string[];
};

function configuredCorsOrigins(): string[] {
  const configured =
    serverEnv.API_CORS_ORIGINS ?? clientEnv.NEXT_PUBLIC_SITE_URL;
  return configured
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

function handleTrpcRequest(request: Request): Promise<Response> {
  return fetchRequestHandler({
    endpoint: TRPC_HTTP_PATH,
    req: request,
    router: AppRouter,
    createContext: () => createTRPCContext({ headers: request.headers }),
    onError({ error, path }) {
      console.error(`[tRPC] ${path ?? "unknown"}`, error);
    },
  });
}

export function createApiApp(options: CreateApiAppOptions = {}) {
  const app = new Hono<ApiBindings>();
  const corsOrigins = options.corsOrigins ?? configuredCorsOrigins();

  app.use("*", requestId());
  app.use("*", secureHeaders());
  app.use(
    "*",
    cors({
      origin: corsOrigins,
      allowHeaders: ["Authorization", "Content-Type", "X-Request-Id"],
      allowMethods: ["GET", "POST", "OPTIONS"],
      exposeHeaders: ["X-Request-Id"],
      maxAge: 86_400,
    }),
  );

  app.get("/health", (context) =>
    context.json({
      status: "ok" as const,
      requestId: context.get("requestId"),
    }),
  );

  app.all(TRPC_HTTP_PATH, (context) => handleTrpcRequest(context.req.raw));
  app.all(`${TRPC_HTTP_PATH}/*`, (context) =>
    handleTrpcRequest(context.req.raw),
  );

  app.notFound((context) =>
    context.json(
      { error: "Not Found", requestId: context.get("requestId") },
      404,
    ),
  );

  app.onError((error, context) => {
    console.error(`[Hono] ${context.get("requestId")}`, error);
    return context.json(
      { error: "Internal Server Error", requestId: context.get("requestId") },
      500,
    );
  });

  return app;
}

export const app = createApiApp();
