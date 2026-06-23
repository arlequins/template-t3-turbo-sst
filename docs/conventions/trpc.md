# tRPC Router Convention: DIP 4-layer Structure

Read this when adding or changing tRPC procedures in `packages/trpc`.

## Architecture

```text
packages/trpc/src/
├── router/               # Thin entry layer: procedure definitions and usecase calls only
│   └── common.ts
├── lib/
│   ├── types/            # DTOs and domain types
│   │   └── common.ts
│   ├── services/
│   │   ├── ports/        # I/O interfaces
│   │   │   └── common-port.ts
│   │   └── common/       # Business logic through ports
│   │       └── index.ts
│   ├── adaptors/
│   │   ├── db/           # Drizzle ORM query implementations
│   │   │   └── sample.ts
│   │   └── external/     # External API implementations
│   │       └── common-api.ts
│   └── usecases/
│       ├── composition/  # Production dependency injection
│       │   └── common-deps.ts
│       └── common/       # run* wrappers called from routers
│           └── index.ts
```

Dependency direction:

```text
router -> usecases -> services -> ports <- adaptors
```

## Implementation Pattern

### Step 1: Define Port Interfaces

Define I/O interfaces in `lib/services/ports/{domain}-port.ts`.

```ts
// lib/services/ports/common-port.ts
export type SamplePort = {
  findSampleByCode(sampleCode: string): Promise<SampleRecord | null>;
  listAllSamples(): Promise<SampleInfo[]>;
  listSamplesForUser(userCode: string): Promise<SampleInfo[]>;
};

export type CommonApiPort = {
  callDepartmentAuth(
    userCode: string,
    departmentType: string,
  ): Promise<{ status: boolean }>;
};
```

### Step 2: Write Deps Types and Business Logic

Write business logic as pure functions in `lib/services/{domain}/index.ts`.

```ts
// lib/services/common/index.ts
import type { CommonApiPort, SamplePort } from "../ports/common-port";

export type CommonDeps = {
  sample: SamplePort;
  commonApi: CommonApiPort;
  isAdmin: (userCode: string) => Promise<boolean>;
};

export async function authenticateSample(
  deps: CommonDeps,
  input: AuthSampleInput,
): Promise<AuthSampleResult> {
  const sample = await deps.sample.findSampleByCode(input.sampleCode);
  if (!sample) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  // ...
}
```

Do not depend directly on the database or external APIs from this layer. Use dependencies passed through `deps`.

### Step 3: Implement Adapters

Implement ports in `lib/adaptors/db/` or `lib/adaptors/external/`.

```ts
// lib/adaptors/db/sample.ts
import { eq } from "@acme/db-backbone";
import { db } from "@acme/db-backbone/client";
import { TmSample } from "@acme/db-backbone/schema";

import type { SamplePort } from "../../services/ports/common-port";

export const sampleAdaptor: SamplePort = {
  async findSampleByCode(sampleCode) {
    const [row] = await db
      .select()
      .from(TmSample)
      .where(eq(TmSample.sampleCode, sampleCode))
      .limit(1);

    return row ?? null;
  },
};
```

External API adapters belong in `lib/adaptors/external/`, such as `common-api.ts` or `payments-api.ts`.

### Step 4: Compose Dependencies

Inject adapters in `lib/usecases/composition/{domain}-deps.ts`.

```ts
// lib/usecases/composition/common-deps.ts
import type { CommonDeps } from "../../services/common";
import { sampleAdaptor } from "../../adaptors/db/sample";
import { commonApiAdaptor } from "../../adaptors/external/common-api";

export const defaultCommonDeps: CommonDeps = {
  sample: sampleAdaptor,
  commonApi: commonApiAdaptor,
  isAdmin: isAdminUser,
};
```

### Step 5: Add usecase Wrappers and Call Them from Routers

```ts
// lib/usecases/common/index.ts
import { authenticateSample } from "../../services/common";
import { defaultCommonDeps } from "../composition/common-deps";

export const runAuthSample = (input: AuthSampleInput) =>
  authenticateSample(defaultCommonDeps, input);
```

```ts
// router/common.ts
const commonRouter = {
  authSample: protectedProcedure
    .input(authSampleInputSchema)
    .mutation(async ({ input }) => runAuthSample(input)),
} satisfies TRPCRouterRecord;
```

## Adding a New Router

1. Define input and output DTO types in `lib/types/{domain}.ts`.
2. Define port interfaces in `lib/services/ports/{domain}-port.ts`.
3. Implement database adapters in `lib/adaptors/db/{domain}.ts`.
4. Implement external API adapters in `lib/adaptors/external/{domain}-api.ts` when needed.
5. Add dependencies and business logic in `lib/services/{domain}/index.ts`.
6. Compose dependencies in `lib/usecases/composition/{domain}-deps.ts`.
7. Add `run*` wrappers in `lib/usecases/{domain}/index.ts`.
8. Add the thin entry layer in `router/{domain}.ts`.
9. Register the router in `packages/trpc/src/root.ts`:

```ts
export const appRouter = createTRPCRouter({
  domain: createTRPCRouter(domainRouter),
});
```

## Zod Output Schemas

Always add `.output()` when a procedure returns a complex shape, such as many columns or nested objects. It is also required when TypeScript reports TS7056 because the inferred type exceeds the maximum length.

```ts
const itemSchema = z.object({
  receivedDate: z.string(),
  itemNo: z.number().int(),
});

list: protectedProcedure
  .input(listInputSchema)
  .output(z.array(itemSchema))
  .query(async ({ input }) => {
    // ...
  });
```

For large routers:

```ts
const inspectionRouter = {
  // ...
} satisfies TRPCRouterRecord;

export const largeRouter: AnyRouter = createTRPCRouter({
  inspection: createTRPCRouter(inspectionRouter),
}) as AnyRouter;
```

## Common Mistakes

| Mistake                                       | Correct approach                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| Writing Drizzle queries directly in `router/` | Create an adapter in `lib/adaptors/db/` and call it through a port.      |
| Calling `fetch` directly in `router/`         | Create an external API adapter in `lib/adaptors/external/`.              |
| Defining `Deps` types in `router/`            | Define them in `lib/services/{domain}/index.ts`.                         |
| Leaving `.output(z.unknown())` in place       | Replace it with an explicit Zod output schema.                           |
| Triggering TS7056 with deeply nested routers  | Use `satisfies TRPCRouterRecord` internally and export with `AnyRouter`. |
