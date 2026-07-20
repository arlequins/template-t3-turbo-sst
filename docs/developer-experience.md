# Developer Experience

## Reproducible Workspace

Open the repository in a Dev Container or GitHub Codespaces to get Node.js 24, Docker access, forwarded local ports, Biome, and installed workspace dependencies. Docker remains outside the container so PostgreSQL and E2E services use the same Compose files as local development.

## Generators

Run `pnpm turbo gen` and select one of these generators:

| Generator | Result |
| --- | --- |
| `app` | A runnable TypeScript workspace under `apps/` |
| `package` | A compiled TypeScript library under `packages/` |
| `domain` | A DIP-aligned tRPC domain with types, port, service, adapter, composition, use case, router registration, and contract update |

Names must be lowercase kebab-case. The active package scope is read from the initialized workspace instead of being hard-coded.

## Fast Feedback

- `pnpm env:check` verifies every validated server and browser variable appears in `.env.example`.
- `pnpm check:changed` runs lint, typecheck, and test only for workspaces changed since `origin/develop`. Pass `-- --base <ref>` or set `CHANGE_BASE` to override it.
- `pnpm example:remove` removes the public example post CRUD surface and preserves its source in `.template/example-crud`.
- `pnpm example:regenerate` restores that preserved CRUD surface.

Commit `.template/example-crud` together with an intentional example removal if later regeneration must remain available to other contributors.

## Quickstart Qualification

CI qualifies generated full and minimal repositories without AWS credentials. The manual `Quickstart deployment qualification` workflow additionally renames a fresh template, validates it, assumes `AWS_QUICKSTART_ROLE_ARN` through GitHub OIDC, performs the first API and web deployment, and always removes the sandbox stage.
