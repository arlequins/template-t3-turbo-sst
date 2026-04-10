# Changelog

This project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-04-09

### Summary

- **Initial stable release.** Inspired by T3 / [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo), but AWS deployment, batch jobs, and shared packages diverge significantly (see README *How this differs from a stock T3 template*).

### Included

- **Apps:** `apps/web` (Next.js static export + tRPC client), `apps/api` (TanStack Start + tRPC + Nitro on AWS), `apps/batch` (SST Step Functions + Lambda + EventBridge Cron).
- **Shared packages:** `@acme/db`, `@acme/trpc`, `@acme/ui`, `@acme/env`, `@acme/validators`, etc.
- **Infrastructure:** SST (Ion) on AWS; `tooling/sst-bootstrap` for Secrets Manager ↔ root `.env` sync.
- **Tooling:** Turborepo, pnpm workspaces, shared ESLint/Prettier (`tooling/eslint`).

### Docs

- Root README updated with tech stack, T3 divergence note, and repository layout.
