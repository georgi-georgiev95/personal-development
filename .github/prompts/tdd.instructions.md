---
name: tdd
description: Enforce strict Test-Driven Development (TDD) with RED → GREEN → REFACTOR cycle. Use when the user wants to implement features or fix bugs using TDD methodology.
applyTo: '**/*.{ts,tsx,js,jsx}'
---

# Test-Driven Development Skill

## Purpose

This skill enforces strict Test-Driven Development (TDD).

The agent must always:

1. Define expected behavior with a failing test.
2. Verify the test fails for the correct reason.
3. Write the minimum production code required.
4. Run tests again.
5. Refactor while keeping tests green.

The goal is not maximizing code output. The goal is producing verified behavior through tests.

---

# Core Rule

Never write production code before writing a failing test.

Production code exists only to satisfy a failing test.

---

# TDD Cycle

Always follow:

1. RED
2. GREEN
3. REFACTOR

## RED

Create a test describing the desired behavior.

Requirements:

- Test only one behavior.
- Test must fail.
- Verify failure occurs for the expected reason.
- Avoid implementing production code.

## GREEN

Write the minimum amount of code required.

Requirements:

- Solve only the failing test.
- Avoid future-proofing.
- Avoid adding unrelated features.
- Do not optimize.

## REFACTOR

Improve code quality.

Allowed:

- Rename variables.
- Extract functions.
- Remove duplication.
- Improve readability.

Requirements:

- Behavior must remain unchanged.
- Tests must remain green.

---

# New Feature Workflow

When implementing a new feature:

1. Understand requirements.
2. Identify one behavior.
3. Write one failing test.
4. Implement minimal code.
5. Make test pass.
6. Refactor.
7. Repeat for the next behavior.

Example:

Feature:
"Users can reset passwords."

Order:

1. Test reset email is sent.
2. Implement email sending.
3. Test invalid email handling.
4. Implement validation.
5. Test expiration token.
6. Implement expiration.

Never implement the entire feature before testing.

---

# Bug Fix Workflow

When fixing a bug:

1. Reproduce the bug.
2. Write a test that demonstrates the bug.
3. Confirm the test fails.
4. Fix the code.
5. Confirm the test passes.

Rules:

- Never fix a bug without a regression test.
- The regression test becomes permanent.
- The bug is not considered fixed until the test passes.

Example:

Bug:
Discount code incorrectly applies twice.

Process:

1. Write failing test:
   "Discount applies only once."
2. Run test and verify failure.
3. Fix calculation logic.
4. Confirm test passes.

---

# Scope Control

The agent must implement only what current failing tests require.

Forbidden:

- Future features.
- Speculative abstractions.
- Generalization.
- Unused configuration.
- Unused interfaces.
- Unused classes.

Follow YAGNI:

"You Aren't Gonna Need It."

---

# Test Quality Rules

Tests should:

- Describe behavior.
- Be independent.
- Be deterministic.
- Be readable.
- Have a single reason to fail.

Avoid:

- Testing implementation details.
- Testing private methods.
- Large integration tests for small behavior.
- Multiple assertions for unrelated behaviors.

Preferred naming:

- should_return_user_when_id_exists
- should_throw_when_token_expired
- should_not_apply_discount_twice

---

# Agent Decision Rules

Before writing production code ask:

1. Which test requires this code?
2. Is there a failing test?
3. Is this the smallest solution?
4. Am I implementing untested behavior?
5. Can this be postponed until another failing test exists?

If no failing test exists:

DO NOT WRITE PRODUCTION CODE.

---

# Refactoring Rules

Refactor only when:

- Tests are green.
- Behavior is covered.

Examples:

- Extract helper methods.
- Remove duplication.
- Improve naming.
- Simplify logic.

Never refactor while tests are failing.

---

# Large Features

Break large features into behaviors.

Bad:

"Implement shopping cart."

Good:

1. Add item to cart.
2. Remove item from cart.
3. Update quantity.
4. Calculate total.
5. Apply coupon.
6. Calculate tax.

Each behavior follows:

RED → GREEN → REFACTOR

---

# Testing Priorities

Prefer:

1. Business behavior.
2. Domain logic.
3. Edge cases.
4. Error handling.
5. Integration behavior.
6. UI behavior.

Avoid excessive UI testing when domain tests provide sufficient coverage.

---

# Code Generation Rules

The agent must:

- Write the smallest failing test.
- Write the smallest passing implementation.
- Remove duplication after tests pass.
- Commit behavior incrementally.

The agent must not:

- Implement multiple behaviors simultaneously.
- Predict future requirements.
- Add abstractions without duplication.
- Rewrite unrelated code.
- Optimize prematurely.

---

# Example Agent Response

Task:
"Add email validation."

Agent workflow:

Step 1:
Write failing test:
"should_reject_invalid_email"

Step 2:
Run tests and confirm failure.

Step 3:
Implement minimal validation.

Step 4:
Run tests and confirm success.

Step 5:
Refactor if necessary.

Step 6:
Proceed to the next behavior.

---

# Completion Criteria

Work is complete only when:

- All tests pass.
- New behavior is covered.
- Bugs have regression tests.
- No unnecessary code exists.
- Code was introduced only because of failing tests.

The tests define the system behavior.

Production code merely satisfies the tests.
