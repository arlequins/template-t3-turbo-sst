# template-t3-turbo-sst

## Installation

> [!NOTE]
>
> Make sure to follow the system requirements specified in [`package.json#engines`](./package.json#L4) before proceeding.

There are two ways of initializing an app using the `create-t3-turbo` starter. You can either use this repository as a template:

![use-as-template](https://github.com/t3-oss/create-t3-turbo/assets/51714798/bb6c2e5d-d8b6-416e-aeb3-b3e50e2ca994)

or use Turbo's CLI to init your project (use PNPM as package manager):

```bash
npx create-turbo@latest -e https://github.com/t3-oss/create-t3-turbo
```

## About

Ever wondered how to migrate your T3 application into a monorepo? Stop right here! This is the perfect starter repo to get you running with the perfect stack!

It uses [Turborepo](https://turborepo.com) and contains:

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ web
  │   ├─ Next.js (static export + SST StaticSite)
  │   ├─ React 19, Tailwind CSS v4
  │   └─ tRPC client
  └─ api
      ├─ TanStack Router + Vite (Hono-style API routes)
      ├─ tRPC server
      └─ SST for deploy/dev
packages
  ├─ auth, db, service, trpc, ui, validators
  │   └─ shared libraries (Drizzle, better-auth, tRPC router, etc.)
tooling
  ├─ eslint
  │   └─ shared, fine-grained, eslint presets
  ├─ prettier
  │   └─ shared prettier configuration
  ├─ sst-bootstrap
  │   └─ first-time env: `pnpm env:pull` / `pnpm env:push` (AWS Secrets Manager)
  ├─ tailwind
  │   └─ shared tailwind theme and configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this template, we use `@acme` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@acme` to something like `@my-company` or `@project-name`.

## Quick Start

> **Note**
> The [db](./packages/db) package is preconfigured to use Supabase and is **edge-bound** with the [Vercel Postgres](https://github.com/vercel/storage/tree/main/packages/postgres) driver. If you're using something else, make the necessary modifications to the [schema](./packages/db/src/schema.ts) as well as the [client](./packages/db/src/index.ts) and the [drizzle config](./packages/db/drizzle.config.ts). If you want to switch to non-edge database driver, remove `export const runtime = "edge";` [from all pages and api routes](https://github.com/t3-oss/create-t3-turbo/issues/634#issuecomment-1730240214).

To get it running, follow the steps below:

### 1. Setup dependencies

> [!NOTE]
>
> This repo uses `apps/web` (Next.js) and `apps/api` (TanStack Router + tRPC). Do not add an `apps/nextjs` folder: `pnpm-workspace.yaml` includes `apps/*`, so any subdirectory without a `package.json` triggers workspace tooling warnings (for example from sherif).

```bash
# Install dependencies
pnpm i
```

### Environment variables (first-time setup)

Use a root `.env` before running database or app commands. Pick one approach:

**A. AWS Secrets Manager (good for a fresh clone or new machine)**  
With credentials that can call `secretsmanager:GetSecretValue` (for example `AWS_PROFILE` or `SST_AWS_PROFILE`), set at least:

- `SECRET_NAME` — middle path of the secret, e.g. `core/environments`.
- `ENV_TARGET` — last path segment and which `.env` file to use, e.g. `root` → secret `…/root` and repo root `.env`.
- `SM_PREFIX`, or `SST_STAGE` / `STAGE` (optional) — **leading** path segment (prefix), e.g. `offline` → `offline/core/environments/root`. Prefer `SM_PREFIX` or `--stage` so app `SST_STAGE=localhost` does not affect the secret name (skip if `SECRET_NAME` is a full ARN).
- `AWS_REGION` — same region as the secret (or use `SST_AWS_REGION`).

Then pull the secret into a `.env` file (the file is **replaced**; nothing is merged from an old file). By default that is the **repo root** `.env`. To write `apps/web/.env` or `apps/api/.env`, set `ENV_TARGET=web` (or `api`) or pass `--env-target web` (the `apps/<name>` directory must already exist).

```bash
pnpm env:pull
# e.g. apps/web/.env
pnpm env:pull -- --env-target web
```

For flags and edge cases, see `pnpm env:pull -- --help` and [`.env.example`](./.env.example). Implementation: [`tooling/sst-bootstrap/scripts/pull-secret-env.mjs`](./tooling/sst-bootstrap/scripts/pull-secret-env.mjs).

**B. Manual**  
Copy [`.env.example`](./.env.example) to `.env` and fill in values.

**Uploading local env to Secrets Manager**  
When you want to sync a file _to_ AWS (create or update the secret), use `pnpm env:push` after setting the same naming variables. The default input path follows `ENV_TARGET` / `--env-target` like pull (root `.env` vs `apps/<name>/.env`). `.json` root objects are also supported. Run `pnpm env:push -- --help`. Script: [`tooling/sst-bootstrap/scripts/push-secret-env.mjs`](./tooling/sst-bootstrap/scripts/push-secret-env.mjs).

### 2. Database schema

After root `.env` is in place:

```bash
pnpm db:push
```

### 3a. When it's time to add a new UI component

Run the `ui-add` script to add a new UI component using the interactive `shadcn/ui` CLI:

```bash
pnpm ui-add
```

When the component(s) has been installed, you should be good to go and start using it in your app.

### 3b. When it's time to add a new package

To add a new package, simply run `pnpm turbo gen init` in the monorepo root. This will prompt you for a package name as well as if you want to install any dependencies to the new package (of course you can also do this yourself later).

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around your package such as formatting, linting and typechecking. When the package is created, you're ready to go build out the package.

## Deployment

### Next.js

#### Prerequisites

> **Note**
> Please note that the Next.js application with tRPC must be deployed in order for the Expo app to communicate with the server in a production environment.

## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).

The stack more originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).

A [blog post](https://jumr.dev/blog/t3-turbo) where I wrote how to migrate a T3 app into this.
