# UI Development

The shared `@acme/ui` package provides three feedback loops:

- React Testing Library and Vitest for component behavior.
- Storybook for isolated visual development and accessibility checks.
- The application end-to-end suite for complete browser workflows.

## Commands

```bash
pnpm --filter @acme/ui test
pnpm storybook
pnpm storybook:build
```

Write tests around accessible roles and user-visible behavior. Keep stories next
to components as `*.stories.tsx`, and include representative states such as
disabled, destructive, loading, and validation states when applicable.

The Storybook accessibility addon reports violations while developing and the
static Storybook build is required by CI. A successful build confirms that every
story can be bundled independently from the Next.js application.
