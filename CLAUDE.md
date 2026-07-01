# Repo Instructions for Claude Code

This project also maintains a tool-agnostic agent harness in `harness/` (see
`harness/GUARDRAILS.md`, `harness/MEMORY.md`, `harness/TOOLS.md`). Load those
for project conventions, architecture, and build/test workflows.

## Mandatory: Pre-PR Gate

Before creating a pull request from this repo, run these in order and confirm
each one is green (exit code 0, no errors):

```bash
pnpm lint
pnpm typecheck
pnpm format
pnpm build
```

If any command fails, fix the issue and re-run the full sequence — do not
open the PR until all four pass. This exists because failing any of these
locally reliably means a failed CI check and a failed deploy.
