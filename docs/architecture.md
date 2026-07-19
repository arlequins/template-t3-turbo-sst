# Application Architecture

This template separates browser delivery, HTTP transport, application APIs, and persistence so each layer can be replaced independently.

```text
Browser
  -> apps/web (Next.js static export, client-side data fetching)
  -> apps/api (Hono HTTP runtime)
       -> packages/trpc (typed procedures and request context)
            -> packages/service (application and domain operations)
                 -> packages/db-backbone (Drizzle schema and PostgreSQL client)
```

## Responsibilities

| Workspace | Responsibility |
| --- | --- |
| `apps/web` | Static Next.js App Router output. Browser interactions and tRPC queries run in Client Components. It does not expose Route Handlers or depend on server-only tRPC modules. |
| `apps/api` | Hono application, CORS, health endpoint, tRPC HTTP adapter, local Node server, and AWS Lambda entry point. |
| `packages/trpc` | tRPC context, middleware, routers, input/output contracts, and browser-safe router types. |
| `packages/service` | Framework-independent application operations. Services receive their dependencies instead of importing a global database client. |
| `packages/db-backbone` | Drizzle schema, PostgreSQL client, migrations, and seeds. |
| `packages/auth` | OIDC discovery, JWKS-backed JWT access-token validation, and application sessions. |

## Request Flow

1. A Client Component calls the browser-safe `@acme/trpc/client` entry point.
2. The tRPC client sends an HTTP request to `${NEXT_PUBLIC_API_URL}/api/trpc`.
3. Hono applies request IDs, security headers, and CORS before forwarding the request to tRPC.
4. tRPC creates request-scoped services backed by the Drizzle database client.
5. Protected procedures use the OIDC `sub` claim as the stable application user ID.
6. The router validates input and delegates the operation to a service.

The web app must never import the server entry point `@acme/trpc` from a Client Component. Use `@acme/trpc/client`, which exports only constants, error helpers, and types that are safe to bundle for the browser.

## Local Development

Copy `.env.example` to `.env`, configure PostgreSQL, and run:

```bash
pnpm dev
```

The defaults are:

- Web: `http://localhost:3000`
- API: `http://localhost:5000`
- Health check: `http://localhost:5000/health`
- tRPC: `http://localhost:5000/api/trpc`

`API_PORT` changes the local API port. `API_CORS_ORIGINS` accepts a comma-separated allowlist and defaults to `NEXT_PUBLIC_SITE_URL`.

## Deployment

- `apps/web/sst.config.ts` deploys the static Next.js export to S3 and CloudFront.
- `apps/api/sst.config.ts` deploys the same Hono app used locally as an AWS Lambda Function URL.
- Optional `SUBNET_IDS` and `SECURITY_GROUP_IDS` attach API and batch Lambdas to a VPC for private database access.

After deploying the API, set `NEXT_PUBLIC_API_URL` to its public URL before building and deploying the web app.

## Extension Rules

- Add ordinary HTTP endpoints directly to `apps/api/src/app.ts` or mount a dedicated Hono route module.
- Add typed application APIs as tRPC routers in `packages/trpc/src/router`.
- Keep database calls out of Hono handlers and tRPC routers; place them in dependency-injected services or adapters.
- Add Drizzle tables under `packages/db-backbone/src/schemas` and export them from `schema.ts`.
- Keep environment reads centralized in `@acme/env` and update `.env.example` plus `turbo.json` when adding variables.
- Generate and commit a Drizzle migration for every schema change, then add a new numbered seed file when reference or example data must change.
