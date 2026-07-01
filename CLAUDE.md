# Repo Instructions for Claude Code

This project also maintains a tool-agnostic agent harness in `harness/` (see
`harness/GUARDRAILS.md`, `harness/MEMORY.md`, `harness/TOOLS.md`). Load those
for project conventions, architecture, and build/test workflows.

## TDD Skill

When the user invokes `/tdd`, or asks to implement a feature or fix a bug
"using TDD", follow `.github/skills/tdd/SKILL.md` (RED → GREEN → REFACTOR).
It only applies to logic in scope for coverage (`src/entities/**`,
`src/shared/utils/**` per `TESTING.md`) — not UI.

## Mandatory: Pre-PR Gate

Before creating a pull request from this repo, run these in order and confirm
each one is green (exit code 0, no errors):

```bash
pnpm lint
pnpm typecheck
pnpm format
pnpm coverage
pnpm build
```

If any command fails, fix the issue and re-run the full sequence — do not
open the PR until all five pass. This exists because failing any of these
locally reliably means a failed CI check and a failed deploy.

`pnpm coverage` must report 100% statements/branches/functions/lines. Per
`TESTING.md`, coverage is enforced only on business logic (`src/entities/**`,
`src/shared/utils/**`) — do not write tests for UI rendering, styling,
Storybook stories, or type definitions.
