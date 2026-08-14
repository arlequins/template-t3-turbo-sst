# Static Portfolio Deployment

This guide covers only the static blog and portfolio theme in `apps/blog`. It
does not require the API, PostgreSQL, OIDC authentication, AWS credentials, or
SST.

## Prepare the Theme

1. Select `blog-theme` when initializing the template.
2. Replace brand, contact, domain, and accent values in
   `apps/blog/src/config/brand.config.ts`.
3. Replace the example MDX articles and images in `apps/blog/content` and
   `apps/blog/public`.
4. Verify content, placeholders, tests, and the static output.

```bash
pnpm --filter @acme/blog-theme content:check
pnpm check:placeholders --strict
pnpm --filter @acme/blog-theme test
pnpm --filter @acme/blog-theme build
```

The deployable site is generated in `apps/blog/out`.

## Vercel

Create a Vercel project from the repository and use:

| Setting | Value |
| --- | --- |
| Root directory | Repository root |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm --filter @acme/blog-theme build` |
| Output directory | `apps/blog/out` |

Set the production domain to the same origin as `siteUrl` in the brand
configuration. This keeps canonical, Open Graph, and `hreflang` URLs correct.

For scheduled publishing, create a Vercel deploy hook, store it as the
`VERCEL_DEPLOY_HOOK_URL` GitHub secret, and set `BLOG_PUBLISH_ENABLED=true` as a
repository variable.

## Other Static Hosts

Any host that serves a directory can publish `apps/blog/out`. Configure unknown
paths to return the generated `404.html`; no server-side route fallback or
runtime environment variables are required.

Run `pnpm check:placeholders --strict` in the production deployment pipeline.
The reusable SST deployment applies the same guard to its web production path,
but the static portfolio remains independent from that workflow.
