---
name: codebase-design
description: "Improve module boundaries and interfaces so behavior is hidden behind small, testable APIs. Use when designing or refactoring code structure, dependencies, or seams between modules."
---

# Codebase Design

Use this skill when a change involves module boundaries, dependency direction,
public interfaces, or making behavior easier to test. Preserve behavior and
keep the design proportional to the problem.

## Workflow

1. Establish the current behavior and ownership before editing. Inspect the
   relevant modules, their consumers, tests, and dependency direction. Identify
   the boundary that is making the change difficult rather than redesigning
   the surrounding code speculatively.
2. Define the smallest useful public API at the consumer boundary. Keep domain
   decisions inside the owning module; expose intent-focused functions or
   interfaces instead of implementation details, framework objects, or data
   storage primitives.
3. Check the dependency direction against the project architecture:
   `shared` must not depend on `features` or `widgets`, and dependencies should
   point toward stable abstractions. Prefer existing project patterns such as
   function-based use cases and the lightweight DI tokens in `src/shared/di/`
   when substitution is actually needed.
4. Create a clean seam with the smallest change that improves one of these
   properties: a consumer can be tested without infrastructure, an
   implementation can change without changing consumers, or ownership becomes
   unambiguous. Avoid an abstraction that has no meaningful seam, no likely
   alternate implementation, and no testing benefit.
5. Move wiring to the composition boundary. Keep infrastructure-specific
   imports out of consumers where the new interface is intended to isolate
   them, and do not introduce a global service locator or broad cross-layer
   dependency.
6. Add or update tests for the contract and business behavior in
   `src/entities/**` and `src/shared/utils/**`. Test consumers through the
   seam, and test error and edge behavior that the interface promises. Do not
   add coverage-driven tests for UI rendering, styling, stories, or types.
7. Review the resulting diff for accidental API expansion, cycles, duplicated
   logic, and needless indirection. Run the narrowest relevant checks and
   report any broader validation that remains.

## Design rules

- Prefer one clear owner per behavior and one narrow reason to change per
  module.
- Name interfaces and functions after the capability they provide, not the
  technology behind them (`PhotoStore` is preferable to `FirestoreWrapper` at
  a domain boundary).
- Keep interfaces explicit and typed; follow the repository's strict
  TypeScript, `@/` import, and Feature-Sliced Design conventions.
- Do not add layers, adapters, repositories, or DI bindings merely for
  symmetry. Add them only when they hide a real dependency, enable useful
  substitution, or clarify ownership.
- Keep the public surface minimal. New callers should not need to know how the
  capability is implemented or composed.

## Completion report

Report the boundary that changed, the public API or seam introduced, why it is
needed, and the checks run. Call out any intentionally deferred redesign.
