# AI Memory

This page is a durable context note for AI agents working in this repository.

## Repository Identity

- This is a pnpm + Turborepo monorepo template with SST, web, API, batch, database, and shared package layers.
- Internal packages use the `@acme/*` scope.
- The repository is private-template oriented by default. Internal packages should remain private unless a publication workflow is intentionally added.
- Documentation should avoid project-specific names from source material and should be written in English.

## Stack Memory

| Area            | Memory                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------- |
| Package manager | pnpm, with versions centralized through `pnpm-workspace.yaml` catalogs.                     |
| Monorepo runner | Turborepo. Root scripts delegate to `turbo run` or `turbo watch`.                           |
| Frontend        | Next.js App Router, React, Tailwind CSS, and tRPC client.                                   |
| API             | Hono HTTP runtime with a tRPC server, local Node entry, and AWS Lambda entry.                |
| Batch           | SST Step Functions, Lambda handlers, EventBridge schedules, and local batch runner scripts. |
| Database        | Drizzle ORM with `postgres.js`.                                                             |
| Validation      | Zod, mostly through shared validator packages.                                              |
| Environment     | Centralized environment validation through `@acme/env` and SST bootstrap tooling.           |
| Tooling         | Biome plus shared Tailwind and TypeScript packages under `tooling/`.                        |

## Package Layout Memory

- `apps/web`: Next.js frontend.
- `apps/api`: API app and tRPC HTTP entry point.
- `apps/batch`: batch workflows and handler configuration.
- `packages/trpc`: tRPC routers, procedures, and server-side tRPC setup.
- `packages/service`: service-layer business operations.
- `packages/db-backbone`: Drizzle schema, database client, migrations, and seeds.
- `packages/env`: environment variable schemas and loaders.
- `packages/validators`: shared Zod schemas.
- `packages/shared`: shared utilities, constants, and seed helpers.
- `packages/types`: shared type definitions.
- `packages/ui`: shared React UI.
- `packages/auth`: auth stubs and auth-related helpers.
- `tooling/*`: shared repository tooling packages.

## Command Memory

| Command                           | Use                                                      |
| --------------------------------- | -------------------------------------------------------- |
| `pnpm install`                    | Install workspace dependencies and run workspace checks. |
| `pnpm build`                      | Build all workspaces through Turborepo.                  |
| `pnpm dev`                        | Start development tasks in watch mode.                   |
| `pnpm dev:next`                   | Start the web app and dependencies in watch mode.        |
| `pnpm dev:sst`                    | Start web, API, and batch SST development tasks.         |
| `pnpm check` / `pnpm check:fix`   | Run Biome lint, format, and assist checks.               |
| `pnpm lint` / `pnpm lint:fix`     | Run Biome lint checks, optionally with fixes.            |
| `pnpm format` / `pnpm format:fix` | Run Biome formatter checks, optionally with fixes.       |
| `pnpm typecheck`                  | Run TypeScript checks.                                   |
| `pnpm test`                       | Run workspace tests through Turborepo.                   |
| `pnpm turbo gen init`             | Scaffold a new package.                                  |

## Coding Memory

- Use named imports and named exports.
- Avoid TypeScript `enum`; use `as const` objects and derived value types.
- Prefer `type` over `interface`, unless declaration merging or external APIs require `interface`.
- Separate type-only imports with `import type`.
- Assume strict TypeScript settings, including `noUncheckedIndexedAccess`.
- Use `workspace:*` for internal dependencies unless an existing package intentionally uses a different workspace range.
- Add external dependency versions to `pnpm-workspace.yaml` catalogs before referencing them from package manifests.

## Architecture Memory

- tRPC routers should stay thin and delegate behavior to usecase wrappers.
- Business logic should live in services and depend on ports rather than concrete I/O.
- Drizzle queries belong in database adapters, not in routers.
- External API calls belong in external adapters, not in routers.
- Environment access should be centralized through `@acme/env`.
- Tests should start with pure shared packages and use Vitest.

## Review Memory

Before proposing a PR or final answer:

1. Confirm `git status --short --branch`.
2. Summarize changed files.
3. Report verification commands and results.
4. Mention any checks that were skipped.
5. Keep the PR body concise and focused on behavior, docs, and verification.
