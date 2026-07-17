# Testing Policy

## Framework

Use Vitest.

- It fits Vite, tsx, ESM, TypeScript, and monorepo workflows well.
- It is straightforward to manage through pnpm catalogs.

## Initial Rollout

Start with pure shared packages:

1. `@acme/validators`, especially Zod schemas.
2. `@acme/shared`, especially constants, utilities, and seed helpers.

Then expand to `@acme/env`, `@acme/service`, and `@acme/trpc`.

## Policy

- Prefer mocks for database and external service dependencies, using `vi.mock` or manual test doubles.
- Consider real database integration tests after the pure layers have sufficient coverage.
- Apply the existing Biome formatter, linter, and import-order conventions to
  test code.
- There is no mandatory coverage percentage yet. At minimum, cover public API happy paths and representative edge cases.

## Test File Location and Naming

- Place tests next to source files, such as `packages/<name>/src/foo.ts` and `packages/<name>/src/foo.test.ts`.
- Use `*.test.ts` and `*.test.tsx`.
- Do not use `*.spec.ts`.
- Shared helpers for multiple tests belong in `packages/<name>/src/__tests__/helpers/*.ts`. Helper files that do not match `*.test.*` should not be direct test targets.

## CI and Turbo Integration

- Add `test` and `test:coverage` tasks to `turbo.json`.
- Run all workspace tests from the root with `pnpm test`.
- Add a test job to `.github/workflows/ci.yml` and run it in parallel with lint, format, and typecheck jobs.
- Do not run tests in pre-commit hooks. Keep pre-commit fast and stop at typecheck.

## Mocking Examples

### Pure Functions

Call the function directly and assert on the result. No mock is needed.

```ts
import { describe, expect, it } from "vitest";

import { createBatchSchema } from "./batch";

describe("createBatchSchema", () => {
  it("accepts valid payload", () => {
    const result = createBatchSchema.safeParse({
      /* ... */
    });

    expect(result.success).toBe(true);
  });
});
```

### Functions that Use a Database

Design the function so it receives a Drizzle client or repository dependency as an argument. In tests, pass a manual double. Replacing an entire module with `vi.mock` should be a last resort.

```ts
// service
export function createPostService(db: Database) {
  return {
    listPublished: () => db.select().from(Posts).where(/* ... */),
  };
}

// test
const dbDouble = {
  select: () => ({ from: () => ({ where: () => [] }) }),
};

const svc = createPostService(dbDouble as unknown as Database);
```
