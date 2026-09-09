---
name: diagnosing-bugs
description: 'Use an evidence-first workflow to reproduce bugs or performance regressions, identify their root causes, and verify minimal fixes in this repository.'
---

# Diagnosing Bugs

Use this skill when investigating a bug, failing check, unexpected behavior, or
performance regression. The goal is to establish the cause before changing
code, then verify the smallest safe fix.

## Workflow

1. Define the failure precisely: expected behavior, actual behavior, affected
   route or module, reliable reproduction steps, and when it started.
2. Gather evidence before editing. Inspect the relevant source, tests, logs,
   browser or runtime errors, and recent changes. Prefer targeted searches and
   the narrowest useful commands.
3. Reproduce the failure with a deterministic test, focused command, or clear
   manual sequence. Record the observed output and distinguish symptoms from
   causes.
4. Trace the failure to its root cause across the relevant Feature-Sliced
   layers. Check data flow, control flow, types, async boundaries, error
   handling, and configuration rather than assuming the first suspicious line
   is responsible.
5. Choose the smallest fix that preserves existing behavior and repository
   conventions. Avoid unrelated refactors and new dependencies. For
   performance issues, inspect the measured budget or profile and prefer
   removing unnecessary work or lazy-loading code.
6. Verify the fix by rerunning the reproduction and relevant tests, then run
   the narrowest applicable lint, typecheck, build, and performance checks.
   Confirm that the original failure is gone and that nearby behavior has not
   regressed.
7. Report the evidence, root cause, files changed, verification performed,
   and any remaining uncertainty. If the issue cannot be reproduced, say so
   and document the checks that were attempted.

## Repository-specific checks

- Follow the project rules in `harness/GUARDRAILS.md` and `harness/CONTEXT.md`.
- Use `@/` imports, strict TypeScript, Linaria styling, and Feature-Sliced
  boundaries when a code change is needed.
- Keep Three.js and Firestore out of the initial chunk; use the existing lazy
  loading patterns when diagnosing or fixing load-performance regressions.
- For business logic in `src/entities/**` or `src/shared/utils/**`, preserve
  the 100% coverage requirement described in `TESTING.md`.
- Do not change performance budgets to make a regression pass without explicit
  user approval.

## Guardrails

- Do not claim a root cause without supporting evidence.
- Do not implement a fix when the user only asks for diagnosis.
- Do not broaden the scope because an unrelated issue appears nearby.
- Preserve user changes and avoid destructive commands.
