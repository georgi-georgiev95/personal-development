---
name: domain-modeling
description: 'Defines shared domain vocabulary, challenges ambiguous concepts and edge cases, and records important decisions in a glossary or ADR.'
---

# Domain Modeling

Clarify the language and rules of a domain before implementation so product,
design, and code refer to the same concepts.

## Workflow

1. Identify the domain, the people or systems involved, the main outcomes, and
   the source material. Separate observed facts from assumptions.
2. Build a glossary of meaningful nouns and verbs. For each term, state its
   precise meaning, important attributes, lifecycle, aliases to avoid, and
   whether it is an entity, value object, event, command, or policy.
3. Challenge ambiguity. Look for overloaded terms, unclear ownership, hidden
   state transitions, conflicting invariants, missing identifiers, time-zone
   or ordering assumptions, duplicate data, and authorization boundaries.
4. Walk through normal, empty, invalid, repeated, concurrent, deleted, and
   partially completed cases. Record the rule that resolves each meaningful
   edge case; do not silently choose behavior when the decision affects users
   or data integrity.
5. Map the model to the repository without forcing domain concepts into
   technical structures: domain entities belong under `src/entities/`, while
   features and widgets consume them through explicit interfaces. Note seams,
   external systems, and terms that should not leak across boundaries.
6. Record consequential decisions as a glossary update or ADR. Include the
   context, decision, alternatives considered, consequences, and status. Keep
   superseded decisions rather than rewriting history.
7. Finish with unresolved questions, assumptions to validate, and a small set
   of model invariants that implementation and tests must preserve.

## Output format

Use this structure unless the user requests another format:

```markdown
# Domain model: [domain]

## Purpose and boundaries

- Outcome: ...
- In scope: ...
- Out of scope: ...

## Glossary

| Term | Definition | Kind | Lifecycle or invariants |
| ---- | ---------- | ---- | ----------------------- |
| ...  | ...        | entity / value object / event / command / policy | ... |

## Relationships and rules

- ...

## Edge cases and decisions

| Scenario | Decision | Rationale |
| -------- | -------- | --------- |
| ...      | ...      | ...       |

## Repository mapping

- Entities and domain logic: ...
- Feature or UI consumers: ...
- External boundaries: ...

## Decision record

- Context: ...
- Decision: ...
- Alternatives: ...
- Consequences: ...
- Status: proposed / accepted / superseded

## Open questions and invariants

- Open questions: None / ...
- Invariants: ...
```

## Boundaries

- Do not implement features, rename code, migrate data, or create an ADR file
  unless the user separately requests that work.
- Do not invent business rules. Mark inferred behavior as an assumption and
  surface decisions that require product or domain-owner confirmation.
- Keep technical architecture subordinate to the domain model; use repository
  conventions to locate code, not to redefine the business concepts.
- Prefer a small, precise glossary and a few consequential decisions over a
  large catalog of generic terms.
