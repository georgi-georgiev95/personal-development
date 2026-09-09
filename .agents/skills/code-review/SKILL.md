---
name: code-review
description: 'Review changes against the project standards, requested specification, and unnecessary complexity, then report consistent, actionable findings.'
---

# Code Review

Evaluate a change as a reviewer. Do not modify files unless the user separately
asks for fixes.

## Workflow

1. Establish the review scope from the user request, ticket or issue, and the
   current diff. Read the relevant repository guidance before judging the
   change.
2. Inspect the complete diff and the surrounding source needed to understand
   behavior. Check both staged and unstaged changes when the user asks for a
   working-tree review.
3. Review in this order:
   - correctness, regressions, and error handling;
   - compliance with the requested behavior and acceptance criteria;
   - project conventions, architecture, accessibility, responsiveness, and
     security;
   - tests, type safety, formatting, and validation coverage;
   - unnecessary complexity, duplication, dependencies, and performance-costly
     implementation choices.
4. Verify important concerns with focused searches or commands when practical.
   Prefer evidence from tests, types, lint rules, build configuration, and
   existing patterns over stylistic preference.
5. Report findings from highest to lowest impact. Each finding must include:
   - severity: use `blocker`, `high`, `medium`, or `low`;
   - exact file and line (or the smallest applicable range);
   - what is wrong and why it matters;
   - a concrete remediation suggestion.
6. End with a concise verdict: whether the change is ready, needs fixes, or has
   no findings. Separate findings from optional suggestions and state which
   checks were run or not run.

## Review Standards

- Treat the requested specification as the source of truth for behavior.
- Apply this repository's `harness/GUARDRAILS.md`, `harness/CONTEXT.md`, and
  `harness/MEMORY.md` plus relevant project instructions.
- Flag violations such as relative imports, inline styles, unsafe auth or
  Firestore access, missing lazy loading for heavy code, broken responsive or
  accessible behavior, and performance-budget regressions.
- Do not report an issue without a concrete impact or evidence. Do not require
  tests for UI-only changes when the repository's testing guidance excludes
  them, but do require tests for covered business logic.
- Keep the review focused: avoid requesting abstractions or refactors that do
  not improve correctness, maintainability, security, or performance.
