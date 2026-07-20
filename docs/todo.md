# Template Improvement TODO

This list tracks improvements that make the repository safer and easier to reuse as a general application template.

## High Priority

- [x] Replace the permissive authentication stub with OIDC Authorization Code + PKCE in the browser and JWT access-token validation in the API.
- [x] Restrict sample seeds to `offline` and `test`, or require an explicit `SEED_SAMPLE_DATA=true` opt-in.
- [x] Add a local PostgreSQL `compose.yml` and `db:start` / `db:stop` commands for a zero-setup development path.
- [x] Add `DATABASE_SSL_MODE=disable|require|verify-full` instead of forcing one TLS behavior for every environment.
- [x] Run migration, seed idempotency, and representative tRPC CRUD integration tests against PostgreSQL in CI.

## Template Experience

- [x] Add `pnpm template:init` to rename `@acme`, SST application names, package metadata, and example domains safely.
- [x] Make batch, authentication, SST deployment, and example UI modules selectable generator options while keeping `web + api + trpc + db` as the minimal preset.
- [x] Offer documented API deployment presets for Lambda Function URLs and API Gateway, including throttling, WAF, and custom-domain tradeoffs.

## Operations

- [x] Add structured logging and propagate the Hono request ID through tRPC and service logs.
- [x] Split health checks into liveness and readiness endpoints, with readiness checking required dependencies such as PostgreSQL.
- [x] Limit automated dependency merging to compatible patch and minor releases; isolate major updates for TypeScript, Next.js, SST, Drizzle, and authentication libraries.

## Template Qualification

- [x] Generate full and minimal presets in isolated repositories and run install, check, test, typecheck, and build in CI.
- [x] Add a scaffold mode that removes unselected feature files and dependencies instead of retaining dormant examples.
- [x] Fail generated-template validation when the original package scope, project name, or example domain remains.
- [x] Fail installation early with actionable Node.js and pnpm version guidance.
- [x] Run template initializer tests on Linux, macOS, and Windows.

## Deployment and Supply Chain

- [x] Add GitHub Actions AWS OIDC deployment without long-lived access keys.
- [x] Add pull-request preview stages and automatic cleanup after merge.
- [x] Document production approvals, branch protection, and least-privilege IAM examples.
- [x] Add dependency review, CodeQL, secret scanning guidance, SBOM generation, and license checks.
- [x] Harden API security headers and document a deploy-time Content Security Policy for variable web origins.

## Database Operations

- [x] Define deployment migration order and prevent concurrent migrations with a PostgreSQL advisory lock.
- [x] Add backup and restore scripts with a side-by-side restore verification workflow.
- [x] Physically separate production reference seeds from sample data.
- [x] Document migration failure recovery and application rollback procedures.

## Authorization

- [x] Provision an application user on first successful OIDC login.
- [x] Add dependency-injected RBAC ports and protected tRPC procedure examples.
- [x] Test token expiry and cover silent-renew failure and logout propagation through client events and end-to-end logout.
- [x] Add a multi-provider issuer configuration model and authentication audit logs.

## Observability

- [x] Add replaceable OpenTelemetry tracing for HTTP, tRPC, and database operations.
- [x] Add CloudWatch metrics, dashboards, alarms, and Lambda cold-start measurements.
- [x] Add a replaceable error-reporting adapter.
- [x] Support optional external dependency readiness checks and publish an incident runbook.

## Test Coverage

- [ ] Add AWS sandbox smoke tests for Function URL and API Gateway presets.
- [ ] Add migration upgrade compatibility tests and tRPC contract regression tests.
- [ ] Add Playwright accessibility and mobile viewport coverage.
- [ ] Add baseline authentication and API load tests with flaky-test policy documentation.

## Developer Experience

- [ ] Add Dev Container and Codespaces configuration.
- [ ] Add generators for applications, packages, and domain modules.
- [ ] Verify environment schema and example files remain synchronized.
- [ ] Add a changed-workspace fast-check command.
- [ ] Add commands to remove and regenerate example CRUD functionality.
- [ ] Continuously verify the quickstart path from initialization to first deployment.
