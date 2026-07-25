# Versioned Blog Theme

The optional `blog-theme` feature is a multilingual, static editorial site. It
is intentionally separate from the authenticated example application in
`apps/web` and can be retained or removed independently.

## Versioning

The theme version is stored in both `apps/blog/package.json` and
`apps/blog/theme.json`. Update both values together and add a concise entry to
`apps/blog/CHANGELOG.md`.

```bash
pnpm --filter @acme/blog-theme version:check
```

The theme follows Semantic Versioning:

- **MAJOR** for a breaking content schema, route, or configuration change.
- **MINOR** for a backwards-compatible layout or component capability.
- **PATCH** for visual, accessibility, and documentation fixes.

## Brand Configuration

Edit `apps/blog/src/config/brand.config.ts` to change the name, collaborator,
description, contact links, canonical site URL, and accent colors. Components
and metadata read this file instead of embedding product-specific values.

Colors are exposed as semantic tokens in `apps/blog/src/app/styles.css`.
Prefer tokens such as `--blog-surface`, `--blog-text`, `--blog-divider`, and
`--blog-accent` when adding components.

## Localized Content

Keep translations beside one another:

```text
apps/blog/content/posts/
├── article-slug.en.mdx
├── article-slug.ja.mdx
└── article-slug.ko.mdx
```

Every locale must use the same slug and `translationKey`. Frontmatter requires:

| Field | Accepted value |
| --- | --- |
| `title` | Non-empty localized title |
| `description` | 20 to 240 characters |
| `category` | `design`, `engineering`, or `notes` |
| `reviewStatus` | `draft`, `in-review`, or `approved` |
| `publishedAt` | ISO date (`YYYY-MM-DD`) |
| `translationKey` | Same value as the filename slug |
| `image` | Root-relative public image path |
| `imageAlt` | Localized image description |
| `featured` | Boolean |

Only approved articles whose publish date has arrived are visible. Validate all
frontmatter and translation coverage before review:

```bash
pnpm --filter @acme/blog-theme content:check
```

## Optional Scheduled Publishing

`.github/workflows/blog-publish.yml` validates and builds the static theme on a
weekly schedule. Set the repository variable `BLOG_PUBLISH_ENABLED` to `true`
and add the `VERCEL_DEPLOY_HOOK_URL` secret to enable deployment. Keeping the
variable unset leaves the template workflow safely disabled.

The local MDX workflow remains the canonical authoring path. A content editor
UI is deliberately deferred until a project needs non-developer authors,
preview state, or external content storage.
