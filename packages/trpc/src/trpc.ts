/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

import type { Permission } from "@acme/auth";
import { authApi, hasPermission, provisionSessionUser } from "@acme/auth";
import { db } from "@acme/db-backbone/client";
import type { Logger, Telemetry } from "@acme/logger";
import { createPostService } from "@acme/service";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError, z } from "zod/v4";
import { databaseUserProvisioning } from "./adaptors/auth-user";
import { getPostCache } from "./cache";
import { formatTrpcErrorShape } from "./errors";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

export const createTRPCContext = async (opts: {
  headers: Headers;
  logger: Logger;
  telemetry: Telemetry;
}) => {
  const tokenSession = await authApi.getSession({
    headers: opts.headers,
  });
  const session = tokenSession
    ? await opts.telemetry.trace(
        "db.user.provision",
        { "db.system": "postgresql" },
        () => provisionSessionUser(databaseUserProvisioning, tokenSession),
      )
    : null;
  if (session) {
    opts.logger.info("auth.login.succeeded", {
      issuer: session.user.issuer,
      subject: session.user.subject,
      userId: session.user.id,
    });
  }
  return {
    authApi,
    logger: opts.logger,
    telemetry: opts.telemetry,
    session,
    services: {
      post: createPostService(
        db,
        opts.logger.child({ component: "post-service" }),
        { cache: getPostCache() },
      ),
    },
  };
};
/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) =>
    formatTrpcErrorShape({
      shape,
      error,
      zodError:
        error.cause instanceof ZodError
          ? z.flattenError(error.cause as ZodError<Record<string, unknown>>)
          : null,
    }),
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for lightweight procedure timing.
 */
const timingMiddleware = t.middleware(async ({ ctx, next, path }) => {
  const start = Date.now();

  const result = await ctx.telemetry.trace(
    "trpc.procedure",
    { "trpc.path": path },
    next,
  );

  ctx.logger.info("trpc.procedure.completed", {
    durationMs: Date.now() - start,
    procedure: path,
    status: result.ok ? "ok" : "error",
  });

  return result;
});

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

export function permissionProcedure(permission: Permission) {
  return protectedProcedure.use(({ ctx, next }) => {
    if (!hasPermission(ctx.session.user.roles, permission)) {
      ctx.logger.warn("auth.authorization.denied", {
        permission,
        roles: ctx.session.user.roles,
        userId: ctx.session.user.id,
      });
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return next({ ctx });
  });
}
