# Hono API

The API exposes a lightweight health endpoint and the tRPC transport used by the static Next.js client.

```bash
pnpm --filter @acme/api dev
pnpm --filter @acme/api test
pnpm --filter @acme/api sst:deploy
```

| Path | Purpose |
| --- | --- |
| `GET /health` | Service health and request ID. |
| `/api/trpc/*` | tRPC queries and mutations. |

`src/app.ts` is runtime-independent. `src/dev.ts` serves it with Node for local development, and `src/lambda.ts` adapts the same app to AWS Lambda.
