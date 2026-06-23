# Monorepo Operations

This repository uses pnpm workspaces and Turborepo.

## Version Alignment with pnpm Catalogs

- Manage external dependency versions centrally in `pnpm-workspace.yaml` through `catalog:` and named `catalogs`, such as `catalogs.react19`.
- In each package `package.json`, reference catalog entries with values such as `"drizzle-orm": "catalog:"` instead of writing concrete versions.
- When adding a new dependency, update the catalog first, then reference it from the relevant package.

```yaml
# pnpm-workspace.yaml excerpt
catalog:
  drizzle-orm: ^0.45.2
  zod: ^4.3.6
  typescript: ^5.9.3
catalogs:
  react19:
    react: 19.2.5
    react-dom: 19.2.5
```

```jsonc
// packages/db-backbone/package.json excerpt
{
  "dependencies": {
    "drizzle-orm": "catalog:",
  },
}
```

## Workspace Dependencies

- Use `"@acme/<package>": "workspace:*"` for internal package dependencies.
- Internal packages should be `"private": true` and should not be published to npm unless the repository explicitly defines a publication workflow.

## Dependency Key Order with sherif

- `sherif` checks dependency key order in each `package.json`.
- If it fails, run `pnpm dlx sherif@latest --fix` or the repository workspace-fix script.
- The root `package.json` should wire workspace lint and fix scripts, and may run workspace lint from `postinstall`.

## Task Execution

Run common tasks from the repository root through Turborepo.

| Command                           | Purpose                                           |
| --------------------------------- | ------------------------------------------------- |
| `pnpm build`                      | Production build for all workspaces.              |
| `pnpm dev`                        | Start development servers in watch mode.          |
| `pnpm dev:next`                   | Watch the web app and its dependencies.           |
| `pnpm dev:sst`                    | Start `web`, `api`, and `batch` in SST mode.      |
| `pnpm lint` / `pnpm lint:fix`     | Lint, optionally with automatic fixes.            |
| `pnpm format` / `pnpm format:fix` | Format, optionally with automatic fixes.          |
| `pnpm typecheck`                  | Run TypeScript checks.                            |
| `pnpm clean`                      | Remove untracked files, including `node_modules`. |
| `pnpm db:*` / `pnpm sst:ws`       | Database and SST workspace helper scripts.        |

When adding a new task, define it in `turbo.json` and explicitly decide whether it is cacheable and what its `outputs` are.

## Pre-commit Hooks

`.husky/pre-commit` should run the fast checks needed to keep the repository healthy. A typical sequence is:

1. `pnpm lint:fix`
2. `pnpm format:fix`
3. `git add -u`
4. `pnpm typecheck`

Commit message validation belongs in `.husky/commit-msg`; see [Git enforcement](git.md#enforcement).

## Creating Packages

Prefer the Turborepo generator over manual scaffolding.

```bash
pnpm turbo gen init
```

The generator should prompt for the package name. The `@acme/` prefix may be added automatically by the generator.

Generated files should include:

| File                               | Purpose                                                       |
| ---------------------------------- | ------------------------------------------------------------- |
| `packages/<name>/package.json`     | `private: true`, `type: "module"`, scripts, and dependencies. |
| `packages/<name>/tsconfig.json`    | Extends `@acme/tsconfig`.                                     |
| `packages/<name>/eslint.config.ts` | Extends `@acme/eslint-config`.                                |
| `packages/<name>/src/index.ts`     | Empty or minimal package entry point.                         |

After running the generator:

1. Export the public API from `packages/<name>/src/index.ts` with named exports.
2. Add the `exports` field to `packages/<name>/package.json`.
3. Add any required tasks to `turbo.json`.
4. Run `pnpm install` from the root if the generator did not already do it.
5. Run the workspace lint command to verify package key order.

## Environment Variables and Secrets

- Apps should not keep scattered `apps/<name>/.env.*` files when the environment is injected through shared tooling or deployment infrastructure.
- Use root-level `env:pull` and `env:push` scripts to synchronize secrets when those scripts are available.
- Do not read `process.env` directly throughout application code. Centralize environment loading and validation in a shared environment package, such as `@acme/env`.
