---
name: to-tickets
description: 'Decomposes a specification or plan into small, dependency-ordered implementation tickets with explicit blocking relationships.'
---

# To Tickets

Turn an implementation-ready specification or plan into a practical sequence
of small tickets that can be developed and reviewed independently.

## Workflow

1. Read the complete specification or plan and identify its required outcome,
   constraints, acceptance criteria, and assumptions. If the source is missing
   or not concrete enough to decompose, ask for it before drafting tickets.
2. Extract the smallest meaningful deliverables. Keep each ticket focused on
   one coherent outcome that can be implemented, tested, and reviewed without
   hidden work. Prefer vertical slices when they reduce integration risk.
3. Order the tickets by dependency. Add a blocking relationship only when the
   later ticket cannot be implemented or validated until the earlier ticket is
   complete. Keep the dependency graph acyclic and avoid ordering tickets that
   are merely convenient to do first.
4. Check that the tickets collectively cover the specification's in-scope
   behavior and acceptance criteria. Call out uncovered work, assumptions, and
   decisions that still block planning.
5. Produce ticket-ready drafts. Each ticket must include a concise title, a
   `Goal:` paragraph, scope, acceptance criteria, dependencies, and suggested
   validation. Do not assign project sequence numbers unless the user asks.
6. End with the recommended implementation order, parallelizable work, and a
   short list of unresolved blockers.

## Output format

Use this structure unless the user requests another format:

```markdown
# Ticket breakdown: [plan or feature]

## Dependency order

1. T1 — [title]
2. T2 — [title] (blocked by T1)

## Tickets

### T1 — [title]

Goal:
[one outcome-focused paragraph]

In scope:
- ...

Acceptance criteria:
- [ ] ...

Dependencies: None
Validation: ...

### T2 — [title]

Goal:
[one outcome-focused paragraph]

In scope:
- ...

Acceptance criteria:
- [ ] ...

Dependencies: Blocks on T1
Validation: ...

## Parallel work

- ... / None

## Coverage and blockers

- Covered criteria: ...
- Assumptions: ...
- Blocking decisions: None / ...
```

## Boundaries

- Do not create GitHub issues, branches, commits, or pull requests unless the
  user separately requests that action.
- Do not split work into arbitrary technical subtasks, placeholders, or tasks
  that cannot be independently accepted.
- Do not invent dependencies. Distinguish a true blocker from a recommended
  sequence and label assumptions explicitly.
- Keep tickets small without losing a coherent user-visible or independently
  verifiable outcome.
