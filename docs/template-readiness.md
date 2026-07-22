# Template Readiness

This checklist records the reusable baseline provided by the repository. When
adapting the template, retain each capability or remove it deliberately with
its related code, tests, environment variables, and documentation.

## Local Development

- [x] OIDC Authorization Code with PKCE in the browser and JWT access-token
  validation in the API.
- [x] Sample seeds restricted to local and test stages unless explicitly
  enabled.
- [x] Local PostgreSQL through Docker Compose with setup and teardown commands.
- [x] Configurable PostgreSQL TLS behavior.
- [x] Migration, seed idempotency, and representative tRPC integration tests.

## Template Composition

- [x] Repository initialization for package scope, application names, metadata,
  and example domains.
- [x] Full and minimal presets with selectable auth, batch, SST, and example UI
  features.
- [x] Prune mode for physically removing unselected modules and dependencies.
- [x] Application, package, and DIP-aligned tRPC domain generators.
- [x] Removable and regenerable example CRUD functionality.

## Operations and Security

- [x] Structured logging, request ID propagation, liveness, and readiness.
- [x] GitHub Actions AWS OIDC deployment with preview cleanup and production
  approval guidance.
- [x] Dependency review, CodeQL, secret scanning guidance, SBOM generation, and
  license checks.
- [x] Deployment migration ordering, advisory locking, backup, side-by-side
  restore verification, and rollback guidance.
- [x] Replaceable tracing and error reporting with CloudWatch metrics, alarms,
  and an incident runbook.

## Authentication and Authorization

- [x] Application-user provisioning by stable issuer and subject.
- [x] Dependency-injected role and permission checks.
- [x] Multi-provider issuer configuration and authentication audit logs.
- [x] Expiry, renewal failure, logout propagation, and end-to-end sign-out
  coverage.

## Qualification

- [x] Isolated full and minimal generated-repository qualification.
- [x] Detection of leftover template identity values after initialization.
- [x] Early Node.js and pnpm runtime validation.
- [x] Initializer tests on Linux, macOS, and Windows.
- [x] PostgreSQL migration upgrades and tRPC contract regression tests.
- [x] Desktop and mobile Playwright authentication and accessibility coverage.
- [x] AWS sandbox smoke tests and a documented load-test policy.
- [x] Required sandbox endpoint variables with manual workflow overrides and
  visible failure when cloud qualification is not configured.
- [x] Environment schema synchronization and changed-workspace checks.

## Adaptation Review

Before publishing a repository created from this template:

1. Run `pnpm template:init` with the target scope, name, and domain.
2. Choose a preset and prune modules that the application will not use.
3. Replace local and example identity, domain, seed, and IAM values.
4. Configure protected environments, branch rules, and cloud roles.
5. Run the full qualification commands documented in the
   [root README](../README.md#template-qualification).
6. Update `LICENSE`, `NOTICE`, ownership, support, and incident contacts.
