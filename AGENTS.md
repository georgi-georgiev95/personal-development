# Repository Instructions for Codex

This repository uses the shared, tool-agnostic agent harness in `harness/`.

Before starting any task, read these files in order:

1. `harness/GUARDRAILS.md`
2. `harness/CONTEXT.md`
3. `harness/MEMORY.md`

Load task-specific guidance only when relevant:

- Read `harness/SKILLS.md` when creating components, features, 3D scenes, or
  other code covered by its patterns.
- Read `harness/TOOLS.md` when running builds, tests, package-management,
  deployment, or other tooling workflows.
- Read source files selectively according to `harness/CONTEXT.md`.

User instructions take precedence over harness guidelines when they conflict.
Follow system and developer instructions above both.

## TDD Skill

When the user invokes `/tdd`, or asks to implement a feature or fix a bug
"using TDD", follow `.github/skills/tdd/SKILL.md` (RED → GREEN → REFACTOR).
It applies only to logic in scope for coverage (`src/entities/**` and
`src/shared/utils/**` per `TESTING.md`), not UI.

## Mandatory Pre-PR Gate

Before creating a pull request from this repository, run these commands in
order and confirm every command exits successfully:

```bash
pnpm lint
pnpm typecheck
pnpm format
pnpm coverage
pnpm build
pnpm perf
```

If a command fails, fix the issue and rerun the complete sequence. Do not open
the pull request until all six pass.

Run `pnpm perf` after `pnpm build`. It enforces the initial-load performance
budgets defined in `scripts/check-perf-budget.js`. If a change exceeds a
budget, lazy-load the added code or remove it and tell the user. Never increase
a performance budget without explicit user approval.

`pnpm coverage` must report 100% statements, branches, functions, and lines.
Per `TESTING.md`, coverage applies only to business logic in `src/entities/**`
and `src/shared/utils/**`; do not add coverage-driven tests for UI rendering,
styling, Storybook stories, or type definitions.
