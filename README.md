# template-t3-turbo-sst

**v1.0.0** — A pnpm monorepo template inspired by [T3](https://create.t3.gg/) and [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo), extended around **AWS SST (Ion)** and **batch pipelines**. Use it as a GitHub template or clone and rename.

## Tech stack (summary)

| Layer | Stack |
| --- | --- |
| Runtime / package manager | Node.js · **pnpm** workspaces (see [`engines`](./package.json)) |
| Monorepo | **Turborepo** |
| Frontend | **Next.js** (App Router, `output: "export"`) · **Tailwind CSS** · **tRPC** client |
| API | **TanStack Start** · **Vite** · **Nitro** (e.g. `aws-lambda`) · **tRPC** server |
| Batch / orchestration | **SST** `StepFunctions` · **Lambda** · **EventBridge** (`CronV2`) — see `apps/batch` |
| Infrastructure as code | **SST Ion** on **AWS** (S3, CloudFront, Lambda, …) |
| Database | **Drizzle ORM** · **postgres.js** (Node; swap the client yourself for edge-only) |
| Validation / UI | **Zod** · shared **React** UI (`packages/ui`) |
| Auth (default) | **Stubs** only (e.g. bearer) — replace before production |

> **How this differs from a stock T3 template**  
> The name echoes t3-turbo, but this repo goes beyond **Next + a minimal package split**: **web, API, and batch** are defined in one place with **SST**, plus `@acme/env`, Secrets Manager wiring, optional VPC, and other **ops/deploy** layers. It does **not** map 1:1 to upstream create-t3-turbo, and there is no migration guide.

## Requirements

Match the Node and pnpm versions in [`package.json` → `engines`](./package.json).

## Repository layout

```text
.github/           CI (lint, format, typecheck, …)
apps/
  web/             Next.js static export → SST StaticSite (S3 / CloudFront)
  api/             TanStack Start + tRPC → Nitro on AWS Lambda (SST)
  batch/           Step Functions pipelines + EventBridge Cron + handler Lambdas
packages/          @acme/db, trpc, ui, validators, env, service, auth, …
tooling/           eslint, prettier, tailwind, tsconfig, sst-bootstrap (Secrets ↔ .env)
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

Use a **root** `.env` for the database and shared variables.

- **Manual:** copy [`.env.example`](./.env.example) and fill in values.
- **AWS Secrets Manager:** see comments in [`.env.example`](./.env.example) and use `pnpm env:pull` / `pnpm env:push` ([scripts](tooling/sst-bootstrap/scripts/)).

Example (adjust secret names to your layout):

```bash
pnpm env:pull -- --secret-name environments --env-target root
```

### 3. Database schema

With a valid `.env`:

```bash
pnpm db:push
```

### 4. Develop

```bash
pnpm dev:sst
# Next.js only: pnpm dev:next
```

For batch-only local runs, see `pnpm batch:run` or `apps/batch/scripts/dev.ts`.

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
- **API:** `sst deploy` from `apps/api` (e.g. `pnpm -F @acme/api sst:deploy`). See [SST · TanStack on AWS](https://sst.dev/docs/start/aws/tanstack/).
- **Batch:** `apps/batch` `sst.config.ts` — Step Functions + Cron. [`apps/batch/README.md`](./apps/batch/README.md); add steps: [`apps/batch/config/README.md`](./apps/batch/config/README.md).

Set `NEXT_PUBLIC_*` and other env for the target stage before deploy.

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
