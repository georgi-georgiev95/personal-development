# personal-development

A personal development playground — 3D graphics experiments, authentication, and interactive pages. Built with React, TypeScript, Vite, and Three.js.

## Project Structure

Feature-Sliced Design (FSD) — source is organized by ownership, not file type:

```text
src/
  app/              App shell, global layout, and route definitions
  pages/            Route-level compositions (for complex pages)
  widgets/          Reusable composed UI blocks (e.g., ExperimentLayout)
  features/         Feature-owned pages, components, hooks, and styles
    auth/
    home/
  entities/         Business entities and services (user, experiment, etc.)
    user/
  shared/           Cross-feature infra — config, styles, components, utils
    components/
    config/
    styles/
    utils/
  test/             Test setup and global test utilities
```

## Layer Responsibilities

| Layer       | What belongs there                                                          |
| ----------- | --------------------------------------------------------------------------- |
| `app/`      | Routing, app shell, top-level providers (AuthProvider, Router)              |
| `pages/`    | Composed page layouts that wire together widgets and features               |
| `widgets/`  | Reusable UI blocks that use entities/features under the hood                |
| `features/` | Self-contained user-facing features (auth, home, experiments)               |
| `entities/` | Business logic that doesn't belong to a single feature (user service, etc.) |
| `shared/`   | Truly reusable infra — config, styles, global components, utility functions |

## Testing

100% code coverage is enforced on business logic and utilities. See `TESTING.md` for full policy.

- **Test:** entities, utilities, hooks, state management
- **Don't test:** UI rendering, styling, Storybook stories, type definitions
- Coverage scope: `src/entities/**`, `src/shared/utils/**`
- Enforced via `npm run coverage` (fails if any metric drops below 100%)

## Guidelines

- Put feature-specific code inside `src/features/<feature-name>/`.
- Put business entities inside `src/entities/<entity-name>/`.
- Put reusable app-wide code inside `src/shared/`.
- Keep routing in `src/app/routes.tsx`.
- Prefer `@/*` imports over long relative paths.
- No inline styles — use `.styles.ts` files with `@linaria/react`.
- Strong typing everywhere — no `any`.
