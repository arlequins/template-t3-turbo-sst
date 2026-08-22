# Feature-sliced architecture guide

This template combines Clean Architecture for server code with
Feature-Sliced Design (FSD) for the web application. Business rules remain
independent from delivery frameworks, storage providers, and visual screens.

## Dependency direction

```text
Web route -> widget -> feature -> entity -> shared
HTTP adapter -> application port <- provider adapter
                 └─ domain model
```

`pnpm architecture:check` checks server domain/application imports and web
imports that point from a lower FSD layer to a higher one.

## Web layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Shared | `apps/blog/src/shared`, `apps/web/src/shared` | UI primitives, transport helpers, formatters |
| Entities | `apps/blog/src/entities`, `apps/web/src/entities` | business vocabulary and entity models |
| Features | `apps/blog/src/features`, `apps/web/src/features` | user actions and application behavior |
| Widgets | `apps/blog/src/widgets`, `apps/web/src/widgets` | composed screens and sections |
| App | `apps/*/src/app` | route delivery and page composition only |

Existing `components/` and `lib/` directories are compatibility seams. New
features should use the slice directories and move one cohesive capability at
a time.

## Server layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Domain | `packages/*/src/domain`, `apps/api/src/features/*/domain` | pure types and invariants |
| Application | `packages/*/src/application`, `apps/api/src/features/*/application` | use cases and outbound ports |
| Infrastructure | `*/infrastructure`, `*/adaptors`, database packages | provider and persistence adapters |
| Interface | route and handler modules | validation, authorization, response mapping |
| Composition | `*/composition.ts` and app roots | concrete adapter wiring |

## Migration checklist

1. Introduce a provider-independent domain type and invariant.
2. Define an application port and test the use case with a double.
3. Move provider code under `infrastructure/` and wire it in composition.
4. Keep route and page modules thin, then run `pnpm check`, `pnpm typecheck`,
   and `pnpm architecture:check`.

Treat compatibility barrels as temporary seams: remove one only after an
import search is empty and the slice's boundary test is in place.
