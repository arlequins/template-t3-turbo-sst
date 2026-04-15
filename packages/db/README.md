# `@acme/db`

**Drizzle ORM** + **postgres.js** for this monorepo. Schema under `src/`, Drizzle Kit config in [`drizzle.config.ts`](./drizzle.config.ts).

## Scripts (from repo root)

| Root script                | Package script     | Description                                 |
| -------------------------- | ------------------ | ------------------------------------------- |
| `pnpm db:push`             | `push`             | `drizzle-kit push` — apply schema to the DB |
| `pnpm db:pull`             | `pull`             | Introspect DB → schema                      |
| `pnpm db:migrate`          | `migrate`          | Run migrations                              |
| `pnpm db:create-migration` | `create-migration` | `drizzle-kit generate`                      |
| `pnpm db:seed`             | `seed`             | Run TypeScript seeds (see below)            |
| `pnpm db:studio`           | `studio`           | Drizzle Studio                              |

All use `pnpm with-env` and the **repository root** `.env` (`DATABASE_*`).

## Seeds

- **Entry:** [`scripts/seed.ts`](./scripts/seed.ts) calls `runDrizzleSeeds` from **`@acme/shared/seed`** with `scriptDir` set to this package’s `scripts/` directory.
- **Files:** add `scripts/seeds/*.ts` (sorted by filename). Each file must **default-export** an async function `( { tx, stage } ) => void` (see [`@acme/types`](../types/README.md)).
- **`stage`:** `resolveDeployStage()` from `@acme/env` (`production` \| `develop` \| `offline` \| `test`) — branch in TypeScript when SQL alone is not enough.
- **Ledger:** applied seeds are recorded in **`drizzle.__drizzle_seeds`** (schema/table overridable via `runDrizzleSeeds` options; see [`packages/shared`](../shared/README.md)).

## Exports

See [`package.json` → `exports`](./package.json): `@acme/db`, `@acme/db/client`, `@acme/db/schema`.
