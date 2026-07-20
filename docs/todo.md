# Template Improvement TODO

This list tracks improvements that make the repository safer and easier to reuse as a general application template.

## High Priority

- [x] Replace the permissive authentication stub with OIDC Authorization Code + PKCE in the browser and JWT access-token validation in the API.
- [x] Restrict sample seeds to `offline` and `test`, or require an explicit `SEED_SAMPLE_DATA=true` opt-in.
- [x] Add a local PostgreSQL `compose.yml` and `db:start` / `db:stop` commands for a zero-setup development path.
- [x] Add `DATABASE_SSL_MODE=disable|require|verify-full` instead of forcing one TLS behavior for every environment.
- [x] Run migration, seed idempotency, and representative tRPC CRUD integration tests against PostgreSQL in CI.

## Template Experience

- [ ] Add `pnpm template:init` to rename `@acme`, SST application names, package metadata, and example domains safely.
- [ ] Make batch, authentication, SST deployment, and example UI modules selectable generator options while keeping `web + api + trpc + db` as the minimal preset.
- [ ] Offer documented API deployment presets for Lambda Function URLs and API Gateway, including throttling, WAF, and custom-domain tradeoffs.

## Operations

- [x] Add structured logging and propagate the Hono request ID through tRPC and service logs.
- [x] Split health checks into liveness and readiness endpoints, with readiness checking required dependencies such as PostgreSQL.
- [ ] Limit automated dependency merging to compatible patch and minor releases; isolate major updates for TypeScript, Next.js, SST, Drizzle, and authentication libraries.
