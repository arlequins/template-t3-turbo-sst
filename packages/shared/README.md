# `@acme/shared`

Small **cross-cutting** helpers used by multiple packages. Keep **domain logic** in feature packages (`@acme/db-backbone`, apps, …); add only reusable utilities here.

## Exports

| Subpath             | Contents                                                                                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@acme/shared`      | Re-exports (see [`src/index.ts`](./src/index.ts))                                                                                                                 |
| `@acme/shared/seed` | [`runDrizzleSeeds`](./src/seed.ts) — discover `seeds/*.ts` next to a caller `scriptDir`, run in order inside transactions, record names in a Drizzle ledger table |

### `runDrizzleSeeds` (summary)

Used by `@acme/db-backbone`’s `scripts/seed.ts`. Pass `{ scriptDir, db }` (and optionally `ledger` for schema/table names). Loads root `.env` via the caller’s `with-env` so `resolveDeployStage()` and DB URLs behave like the rest of the repo.
