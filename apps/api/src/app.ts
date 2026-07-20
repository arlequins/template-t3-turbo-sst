import { db } from "@acme/db-backbone/client";
import { clientEnv, serverEnv } from "@acme/env";
import type { Logger } from "@acme/logger";
import { createLogger } from "@acme/logger";
import { AppRouter, createTRPCContext, TRPC_HTTP_PATH } from "@acme/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";

export type ApiBindings = {
  Variables: {
    logger: Logger;
    requestId: string;
  };
};

export type CreateApiAppOptions = {
  corsOrigins?: string[];
  logger?: Logger;
  readinessCheck?: () => Promise<void>;
};

async function checkDatabaseReadiness(): Promise<void> {
  await db.execute(sql`select 1`);
}

function configuredCorsOrigins(): string[] {
  const configured =
    serverEnv.API_CORS_ORIGINS ?? clientEnv.NEXT_PUBLIC_SITE_URL;
  return configured
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

function handleTrpcRequest(
  request: Request,
  logger: Logger,
): Promise<Response> {
  return fetchRequestHandler({
    endpoint: TRPC_HTTP_PATH,
    req: request,
    router: AppRouter,
    createContext: () =>
      createTRPCContext({ headers: request.headers, logger }),
    onError({ error, path }) {
      logger.error("trpc.request.failed", {
        error,
        procedure: path ?? "unknown",
      });
    },
  });
}

export function createApiApp(options: CreateApiAppOptions = {}) {
  const app = new Hono<ApiBindings>();
  const corsOrigins = options.corsOrigins ?? configuredCorsOrigins();
  const rootLogger = options.logger ?? createLogger({ service: "api" });
  const readinessCheck = options.readinessCheck ?? checkDatabaseReadiness;

  app.use("*", requestId());
  app.use("*", async (context, next) => {
    const startedAt = Date.now();
    const logger = rootLogger.child({ requestId: context.get("requestId") });
    context.set("logger", logger);

    await next();

    logger.info("http.request.completed", {
      durationMs: Date.now() - startedAt,
      method: context.req.method,
      path: context.req.path,
      status: context.res.status,
    });
  });
  app.use("*", secureHeaders());
  app.use(
    "*",
    cors({
      origin: corsOrigins,
      allowHeaders: [
        "Authorization",
        "Content-Type",
        "Trpc-Accept",
        "X-Request-Id",
      ],
      allowMethods: ["GET", "POST", "OPTIONS"],
      exposeHeaders: ["X-Request-Id"],
      maxAge: 86_400,
    }),
  );

  const liveResponse = (requestId: string) => ({
    status: "ok" as const,
    checks: { process: "ok" as const },
    requestId,
  });

  app.get("/health", (context) =>
    context.json(liveResponse(context.get("requestId"))),
  );

  app.get("/health/live", (context) =>
    context.json(liveResponse(context.get("requestId"))),
  );

  app.get("/health/ready", async (context) => {
    try {
      await readinessCheck();
      return context.json({
        status: "ok" as const,
        checks: { database: "ok" as const },
        requestId: context.get("requestId"),
      });
    } catch (error) {
      context.get("logger").warn("health.readiness.failed", { error });
      return context.json(
        {
          status: "unavailable" as const,
          checks: { database: "unavailable" as const },
          requestId: context.get("requestId"),
        },
        503,
      );
    }
  });

  app.all(TRPC_HTTP_PATH, (context) =>
    handleTrpcRequest(context.req.raw, context.get("logger")),
  );
  app.all(`${TRPC_HTTP_PATH}/*`, (context) =>
    handleTrpcRequest(context.req.raw, context.get("logger")),
  );

  app.notFound((context) =>
    context.json(
      { error: "Not Found", requestId: context.get("requestId") },
      404,
    ),
  );

  app.onError((error, context) => {
    context.get("logger").error("http.request.failed", { error });
    return context.json(
      { error: "Internal Server Error", requestId: context.get("requestId") },
      500,
    );
  });

  return app;
}

export const app = createApiApp();
