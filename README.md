# personal-development

A personal development playground — 3D graphics experiments, authentication, and a community photobook. Built with React, TypeScript, Vite, Three.js, and Firebase.

## Project Structure

Feature-Sliced Design (FSD) — source is organized by ownership, not file type:

```text
src/
  app/              App shell, global layout, and route definitions
    PhotobookSection  Lazy route bundle: DI bindings + photobook pages
  widgets/          Composed UI blocks that may use features/entities
    navigation/       Top navigation bar (auth-aware)
    experiment/       ExperimentLayout wrapper for 3D experiments
  features/         Feature-owned pages, components, hooks, and styles
    auth/             Login/Register pages, AuthProvider, ProfileModal, route guards
    home/             Home page with the featured-project card
    photobook/        Community photo feed — upload, comments, reactions, CMS
  entities/         Business entities and services
    user/             User profile service (Firestore)
    photobook/        Photo/comment/reaction use cases (one file per use case)
    admin/            checkIsAdmin (admins/{uid} collection)
  shared/           Cross-feature infra — no imports from upper layers
    components/       Reusable presentational components (StarFieldBackground, ErrorBoundary, PageSpinner, GlowingOrb)
    ui-kit/           Design-system components (Button, Modal, Skeleton, Text, Avatar, ConfirmDialog, IconButton, Textarea)
    config/           Firebase app/auth/db setup
    di/               DI primitives (createToken, DIProvider, useInjectable)
    styles/           Global reset + theme tokens
    utils/            Utilities (authErrors, performanceMetrics, usePrefersReducedMotion)
  test/             Test setup and global test utilities
```

## Layer Responsibilities

| Layer       | What belongs there                                                           |
| ----------- | ---------------------------------------------------------------------------- |
| `app/`      | Routing, app shell, top-level providers (AuthProvider, Router)               |
| `widgets/`  | Reusable UI blocks that use entities/features under the hood (Navigation)    |
| `features/` | Self-contained user-facing features (auth, home, photobook)                  |
| `entities/` | Business logic that doesn't belong to a single feature (user service, etc.)  |
| `shared/`   | Truly reusable infra — config, styles, ui-kit, components, utility functions |

Import direction is one-way: `shared` → `entities` → `features` → `widgets` → `app`.
`shared/` must never import from `features/` or `widgets/`.

### Dependency Injection

`src/shared/di/` provides a lightweight React-Context DI pattern
(`createToken` / `DIProvider` / `useInjectable`), currently piloted on the
photobook and admin entities. The provider is mounted in
`src/app/PhotobookSection.tsx` — a lazy route — so the bound entities (and
the Firestore SDK they import) stay out of the entry chunk.

## Performance

The app is aggressively code-split — the initial load ships only React, the
router, Firebase Auth, and the app shell (~135 KB gzipped):

- **three.js scenes** (`StarFieldBackground`) load via `React.lazy` after
  first paint.
- **Firestore** stays out of the entry chunk: photobook (with its DI
  bindings), the profile modal, and auth-triggered profile writes all load
  it lazily.
- **Vendor chunking** in `vite.config.ts` keeps three.js / Firebase / React
  in stable, cacheable chunks.

Two tools keep it that way:

- `pnpm perf` — performance budget gate (run after `pnpm build`). Fails if
  the gzipped initial JS/CSS or the largest async chunk exceeds the budgets
  in `scripts/check-perf-budget.js`. Part of the mandatory pre-PR gate.
- `src/shared/utils/performanceMetrics.ts` — runtime web-vitals metrics
  (TTFB, FCP, LCP, CLS, INP) plus `trackInteraction()` for custom
  interaction timing. Logged to the console in dev, silent in prod (swap in
  an analytics reporter in `src/main.tsx`).

## Accessibility

- Global `prefers-reduced-motion` support: CSS animations collapse and the
  3D star field renders a static frame.
- Skip-to-content link, focus-visible styles, labeled form controls, alert
  live-regions for errors, and a focus-trapping modal with Escape-to-close.
- Storybook has `@storybook/addon-a11y` enabled for component-level checks.

## Testing

100% code coverage is enforced on business logic and utilities. See `TESTING.md` for full policy.

- **Test:** entities, utilities, hooks, state management
- **Don't test:** UI rendering, styling, Storybook stories, type definitions
- Coverage scope: `src/entities/**`, `src/shared/utils/**`
- Enforced via `pnpm coverage` (fails if any metric drops below 100%)

## Custom Agent Skills

Project-specific Codex skills live in [`.agents/skills/`](.agents/skills/). They
extend the agent with repeatable workflows and can grow as the project evolves.

| Skill | Purpose | Use when |
| ----- | ------- | -------- |
| `$github-ticket` | Creates a GitHub issue with the next sequential `[PD-X]` title and a `Goal:` description. | A new numbered project ticket is needed. |
| `$start-ticket` | Fetches a `PD-N` GitHub ticket, syncs `develop`, and creates a typed `feature/` or `bugfix/` branch from its label. | Starting implementation work on an existing ticket. |
| `$tdd` | Enforces the RED → GREEN → REFACTOR workflow for business logic and utility changes. | Implementing or fixing covered logic with test-driven development. |
| `$ui-kit` | Scaffolds a reusable UI-kit component with Linaria styles, stories, tests, and exports. | Adding a new component under `src/shared/ui-kit/`. |
| `$code-review` | Reviews changes against project standards, the requested specification, and unnecessary complexity, producing actionable findings. | Reviewing a ticket, diff, branch, or working-tree change. |
| `$ponytail` | Applies a minimal, YAGNI-first approach to coding tasks with configurable intensity. | Simplifying, refactoring, reviewing, or implementing code with the shortest working solution. |
| `$add-new-skill` | Creates a project skill under `.agents/skills/` and registers it in this README. | Adding or importing a new custom agent skill. |
| `$diagnosing-bugs` | Uses an evidence-first workflow to reproduce bugs and performance regressions, identify root causes, and verify minimal fixes. | Investigating unexpected behavior, failing checks, or regressions. |
| `$pr-to-main` | Runs the complete pre-PR gate and creates a pull request from the current branch to `main`. | Opening a validated PR for the current branch. |

When adding a skill, create a directory under `.agents/skills/` with a
`SKILL.md` file and add it to this table with its purpose and usage guidance.

## Guidelines

- Put feature-specific code inside `src/features/<feature-name>/`.
- Put business entities inside `src/entities/<entity-name>/`.
- Put reusable app-wide code inside `src/shared/`.
- Keep routing in `src/app/routes.tsx`.
- Prefer `@/*` imports over long relative paths.
- No inline styles — use `.styles.ts` files with `@linaria/react`.
- Strong typing everywhere — no `any`.
- Heavy dependencies must not enter the initial chunk — lazy-load them and
  verify with `pnpm build && pnpm perf`.
