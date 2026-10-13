# Beta verification checklist

This is the smallest release checklist for the plan-first beta. It keeps
automated evidence separate from the live checks that require an authorized
production session.

## Automated evidence

Run from the repository root:

```bash
node --test prototypes/zero-cost-planning/checks.test.mjs
pnpm lint
pnpm typecheck
pnpm format
pnpm coverage
pnpm build
pnpm perf
```

On 2026-10-13, the Worker checks passed all 7 cases, the application suite
passed 160 tests, business-logic coverage remained at 100%, and the build and
performance budgets passed.

## Authorized live session

Run these checks against the release revision only after production access is
explicitly approved:

- visitor can open `/`, `/demo`, `/login`, and `/register`;
- signed-in user can describe a task, generate real AI output, edit it, copy
  it, save it, reload, and reopen it;
- switching light/dark themes preserves in-progress input and the selected
  mode after reload;
- two accounts cannot read or update each other's saved plans;
- failed saves, stale responses, planner quota errors, and mobile keyboard
  navigation remain safe and legible.

No production deployment is implied by this checklist. The prior live release
evidence is retained in [production verification](production-verification.md).
