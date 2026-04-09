# template-t3-turbo-sst

[T3](https://create.t3.gg/)-style **monorepo** with **Turborepo**, **SST** (AWS), and shared packages. Use it as a GitHub template or clone and rename.

## Requirements

See [`package.json` → `engines`](./package.json) (Node and pnpm versions).

## What’s inside

```text
.github          CI (lint, format, typecheck)
apps
  web            Next.js (output: "export") + tRPC client → SST StaticSite (S3/CloudFront)
  api            TanStack Start + tRPC on Vite → Nitro (e.g. AWS Lambda) via SST
packages         auth, db, service, trpc, ui, validators (shared libraries)
tooling          eslint, prettier, tailwind, tsconfig, sst-bootstrap (Secrets Manager ↔ .env)
```

- **Database:** [Drizzle ORM](https://orm.drizzle.team/) + [`postgres`](https://github.com/porsager/postgres) (Node). Configure `DATABASE_*` in `.env` (see [`.env.example`](./.env.example)). Not Vercel Postgres / edge-only unless you change the client yourself.
- **Package scope:** Names are under **`@acme/*`**. For your fork, find-and-replace `@acme` with your org (e.g. `@myorg`).
- **Auth:** Server/client pieces are **stubs** (bearer + dummy user) so the app runs; replace with real auth before production.

## Quick start

### 1. Install

```bash
pnpm install
```

Do not add empty folders under `apps/` without a `package.json` (workspace tools such as sherif will warn).

### 2. Environment

Use a **root** `.env` for DB and shared vars.

- **Manual:** copy [`.env.example`](./.env.example) → `.env` and fill in values.
- **AWS Secrets Manager:** see comments in [`.env.example`](./.env.example) and run `pnpm env:pull` / `pnpm env:push` ([scripts](tooling/sst-bootstrap/scripts/)).

Example pull (adjust names to your secret layout):

```bash
pnpm env:pull -- --secret-name environments --env-target root
```

### 3. Database

With `.env` valid:

```bash
pnpm db:push
```

### 4. Develop

```bash
pnpm dev:sst
# or Next-only: pnpm dev:next
```

### New UI component

```bash
pnpm ui-add
```

### New package

From the repo root:

```bash
pnpm turbo gen init
```

## Deployment (overview)

- **Web:** static export (`next build`); SST `StaticSite` points at `apps/web` build output.
- **API:** `pnpm -F @acme/api sst:deploy` (see `apps/api/sst.config.ts` and [SST TanStack Start on AWS](https://sst.dev/docs/start/aws/tanstack/)).

Set `NEXT_PUBLIC_*` (and other env) for the target stage before deploy.

## Before you publish a fork (checklist)

1. Replace **`@acme`** across the repo with your scope.
2. Edit **`LICENSE`** (copyright line) for your project or org; update **`NOTICE`** if you change attribution requirements.
3. Add [`.github/FUNDING.yml`](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/displaying-a-sponsor-button-in-your-repository) if you want a Sponsor button.
4. Pin dependency versions when you are ready (`pnpm` overrides / lockfile policy).

## License

This repository is under the [MIT License](./LICENSE). See [NOTICE](./NOTICE) for attribution to the upstream [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) lineage.

`apps/web/next.config.js` sets **`typescript.ignoreBuildErrors: false`** so `next build` runs TypeScript checks (in addition to root `pnpm typecheck`). Temporarily set it to `true` only if you must unblock a deploy while fixing types separately.

## References

- Derived from the [T3](https://github.com/t3-oss/create-t3-app) / [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) ecosystem.
- Monorepo layout and ideas: [blog post (t3-turbo)](https://jumr.dev/blog/t3-turbo).
