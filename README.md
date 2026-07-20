# template-t3-turbo-sst

**v1.0.1** — A pnpm monorepo template inspired by [T3](https://create.t3.gg/) and [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo), extended around **AWS SST (Ion)** and **batch pipelines**. Use it as a GitHub template or clone and rename.

## Tech stack (summary)

| Layer                     | Stack                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Runtime / package manager | Node.js · **pnpm** workspaces (see [`engines`](./package.json))                                                     |
| Monorepo                  | **Turborepo** · shared dependency versions via **pnpm `catalog:`** ([`pnpm-workspace.yaml`](./pnpm-workspace.yaml)) |
| Frontend                  | **Next.js** (App Router, client-only static export) · **Tailwind CSS** · **tRPC** client                             |
| API                       | **Hono** · **tRPC** server · Node.js locally and AWS Lambda in production                                           |
| Batch / orchestration     | **SST** `StepFunctions` · **Lambda** · **EventBridge** (`CronV2`) — see `apps/batch`                                |
| Infrastructure as code    | **SST Ion** on **AWS** (S3, CloudFront, Lambda, …)                                                                  |
| Database                  | **Drizzle ORM** · **postgres.js** (Node; swap the client yourself for edge-only)                                    |
| Validation / UI           | **Zod** · shared **React** UI (`packages/ui`)                                                                       |
| Authentication            | **OpenID Connect** Authorization Code + PKCE · JWKS-backed JWT access-token validation                               |

> **How this differs from a stock T3 template**  
> The name echoes t3-turbo, but this repo goes beyond **Next + a minimal package split**: **web, API, and batch** are defined in one place with **SST**, plus `@acme/env`, Secrets Manager wiring, optional VPC, and other **ops/deploy** layers. It does **not** map 1:1 to upstream create-t3-turbo, and there is no migration guide.

## Requirements

Match the Node and pnpm versions in [`package.json` → `engines`](./package.json). Docker is required for the zero-setup local database and E2E tests.

## Repository layout

```text
.github/           CI (lint, format, typecheck, …)
apps/
  web/             Next.js static export → SST StaticSite (S3 / CloudFront)
  api/             Hono + tRPC → Node.js locally / AWS Lambda Function URL (SST)
  batch/           Step Functions pipelines + EventBridge Cron + handler Lambdas
packages/          @acme/db-backbone, @acme/trpc, @acme/ui, @acme/env, @acme/validators, @acme/types, @acme/shared, … — see [`packages/README.md`](./packages/README.md)
tooling/           tailwind, tsconfig, sst-bootstrap (Secrets ↔ .env)
```

- **Package scope:** `@acme/*` — replace with your org when you fork.
- **Database:** set `DATABASE_*` in the root `.env` (see [`.env.example`](./.env.example)). Not Vercel Postgres by default.

## Quick start

### 1. Install

```bash
pnpm install
```

Do not add empty folders under `apps/` without a `package.json` (workspace tools such as sherif will warn).

### 2. Environment

Use a **root** `.env` for the database and shared variables. [`.env.example`](./.env.example) contains a complete localhost configuration.

- **Manual:** copy [`.env.example`](./.env.example) and fill in values.
- **AWS Secrets Manager:** see comments in [`.env.example`](./.env.example) and use `pnpm env:pull` / `pnpm env:push` ([scripts](tooling/sst-bootstrap/scripts/)).

Example (adjust secret names to your layout):

```bash
pnpm env:pull -- --secret-name environments --env-target root
```

### 3. Local development

Start PostgreSQL, apply migrations and seeds, then launch the local OIDC provider, Hono API, and Next.js app:

```bash
cp .env.localhost.example .env.localhost
pnpm dev:local
```

Open `http://localhost:3000`. The local OIDC login accepts any non-empty username and password. The template database uses host port `55433` to avoid conflicts with an existing PostgreSQL installation. Stop it with `pnpm db:stop`.

### 4. Database setup

With a valid `.env`, apply committed migrations and then pending seeds:

```bash
pnpm db:setup
```

For schema development, generate and validate a migration:

```bash
pnpm db:create-migration --name=describe_change
pnpm db:check
```

See [`packages/db-backbone/README.md`](./packages/db-backbone/README.md) for the migration workflow and [`packages/shared/README.md`](./packages/shared/README.md) for the seed runner.

### 5. Cloud-connected development

```bash
pnpm dev:sst
# Next.js only: pnpm dev:next
```

For batch-only local runs, see `pnpm batch:run` or `apps/batch/scripts/dev.ts`.

### End-to-end tests

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

The E2E runner starts an isolated PostgreSQL 18 container, applies migrations and seeds, starts the local OIDC provider, API, and web app, then verifies PKCE sign-in, protected tRPC CRUD, and sign-out. Test containers and data are removed afterward.

### Add a UI component

```bash
pnpm ui-add
```

### New package (Turbo generator)

```bash
pnpm turbo gen init
```

## Per-stage `.env` and Secrets

When using stage-specific files such as `.env.develop` with Secrets Manager:

```bash
# Secrets Manager → repo-root .env.develop
pnpm env:pull -- --env-file .env.develop
pnpm env:pull -- --out .env.develop

# Local .env.develop → Secrets Manager (only when needed)
pnpm env:push -- --env-file .env.develop
pnpm env:push -- --file .env.develop
```

Day to day, **`env:pull` into your machine** is often enough; use **`env:push`** only when updating secrets in the cloud.

## Deployment (overview)

- **Web:** static output from `next build` → SST `StaticSite`.
- **API:** Hono on an AWS Lambda Function URL. Deploy with `pnpm -F @acme/api sst:deploy`.
- **Batch:** `apps/batch` `sst.config.ts` — Step Functions + Cron. [`apps/batch/README.md`](./apps/batch/README.md); add steps: [`apps/batch/config/README.md`](./apps/batch/config/README.md).

Set `NEXT_PUBLIC_*` and other env for the target stage before deploy.

See [Application Architecture](./docs/architecture.md) for layer boundaries, request flow, and extension rules.
See [OpenID Connect Authentication](./docs/authentication.md) for provider registration and security requirements.

## Before you publish a fork (checklist)

1. Replace **`@acme`** with your org scope everywhere.
2. Edit **`LICENSE`** (copyright); update **`NOTICE`** if your policy requires it.
3. Add [`.github/FUNDING.yml`](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/displaying-a-sponsor-button-in-your-repository) if you want a Sponsor button.
4. Pin dependencies when ready (`pnpm` overrides / lockfile policy).

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT License](./LICENSE). Attribution in [NOTICE](./NOTICE) (upstream [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo), etc.).

`apps/web/next.config.js` sets **`typescript.ignoreBuildErrors: false`** so `next build` runs TypeScript checks. Set it to `true` only as a temporary escape hatch.

## References

- Ideas derived from the [T3](https://github.com/t3-oss/create-t3-app) / [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) ecosystem.
- Monorepo layout: [t3-turbo blog post](https://jumr.dev/blog/t3-turbo).
