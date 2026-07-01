---
name: tdd
description: 'Enforce strict Test-Driven Development (RED -> GREEN -> REFACTOR) when implementing features or fixing bugs. Use whenever the user invokes /tdd, or asks to build/fix something "using TDD". Only applies to logic covered by CLAUDE.md''s 100% coverage scope (src/entities/** and src/shared/utils/**) per TESTING.md -- do not write tests for UI/components/stories.'
---

# Test-Driven Development Skill

## Purpose

Enforce strict Test-Driven Development. The agent must always:

1. Define expected behavior with a failing test.
2. Verify the test fails for the correct reason.
3. Write the minimum production code required.
4. Run tests again.
5. Refactor while keeping tests green.

The goal is not maximizing code output. The goal is producing verified behavior through tests.

## Core Rule

Never write production code before writing a failing test.

Production code exists only to satisfy a failing test.

## Scope: what gets a test

Per `TESTING.md`, only logic gets tests — TDD applies to:

- `src/entities/**` — business entities and services
- `src/shared/utils/**` — pure functions, helpers, formatters, parsers, hooks/reducers with logic

Do NOT apply TDD (do not write a failing test first, do not require coverage) for:

- UI rendering, component output, styling, layout
- Storybook stories
- Type definitions
- Third-party code

If the task is UI-only, skip RED/GREEN/REFACTOR and implement directly.

## TDD Cycle

### RED

Create a test describing the desired behavior.

- Test only one behavior.
- Test must fail.
- Verify failure occurs for the expected reason.
- Avoid implementing production code.

### GREEN

Write the minimum amount of code required.

- Solve only the failing test.
- Avoid future-proofing.
- Avoid adding unrelated features.
- Do not optimize.

### REFACTOR

Improve code quality.

Allowed: rename variables, extract functions, remove duplication, improve readability.

Requirements: behavior must remain unchanged, tests must remain green.

## New Feature Workflow

1. Understand requirements.
2. Identify one behavior.
3. Write one failing test.
4. Implement minimal code.
5. Make test pass.
6. Refactor.
7. Repeat for the next behavior.

Never implement the entire feature before testing.

## Bug Fix Workflow

1. Reproduce the bug.
2. Write a test that demonstrates the bug.
3. Confirm the test fails.
4. Fix the code.
5. Confirm the test passes.

Never fix a bug without a regression test. The regression test becomes permanent.

## Scope Control (YAGNI)

Forbidden: future features, speculative abstractions, generalization, unused configuration/interfaces/classes.

## Test Quality Rules

Tests should be behavior-describing, independent, deterministic, readable, with a single reason to fail.

Avoid: testing implementation details or private methods, large integration tests for small behavior, multiple assertions for unrelated behaviors.

Preferred naming: `should_return_user_when_id_exists`, `should_throw_when_token_expired`, `should_not_apply_discount_twice`.

## Agent Decision Rules

Before writing production code ask:

1. Which test requires this code?
2. Is there a failing test?
3. Is this the smallest solution?
4. Am I implementing untested behavior?
5. Can this be postponed until another failing test exists?

If no failing test exists and the code is in-scope logic: DO NOT WRITE PRODUCTION CODE.

## Verification

After each GREEN step, run:

```bash
pnpm test:run
```

Before considering the task complete, run:

```bash
pnpm coverage
```

and confirm 100% statements/branches/functions/lines on the covered scope (per `vitest.config.ts` and `TESTING.md`).

## Completion Criteria

Work is complete only when:

- All tests pass.
- New logic behavior is covered.
- Bugs have regression tests.
- No unnecessary code exists.
- Code was introduced only because of failing tests.

The tests define the system behavior. Production code merely satisfies the tests.
