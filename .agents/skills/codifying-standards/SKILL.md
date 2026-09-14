---
name: codifying-standards
description: 'Turns repeated review findings into one canonical repository rule, keeping conventions discoverable without duplicating them across documents.'
---

# Codifying Standards

Convert recurring review feedback or team decisions into a single, durable
repository convention that agents and developers can find and apply.

## Workflow

1. Collect the repeated findings and their evidence. Group findings that share
   the same underlying rule, and distinguish a true recurring convention from
   a one-off defect or personal preference.
2. State the desired behavior in plain, normative language. Include the scope,
   rationale, examples of correct and incorrect application, and any explicit
   exceptions. Resolve ambiguous terminology before editing documentation.
3. Locate the most authoritative existing home for the rule. Prefer the
   narrowest canonical source that governs the behavior, such as `AGENTS.md`,
   `harness/`, a project skill, or a focused architecture/testing document.
   Do not create a competing policy file when an appropriate authority exists.
4. Add or revise the rule in that canonical source. Keep it actionable and
   concise, link to related detail when needed, and preserve neighboring
   guidance that is still valid.
5. Search the repository for duplicated or contradictory versions. Replace
   repeated prose with a reference to the canonical rule where authorized;
   retain examples or context only when they add information rather than
   restating the policy.
6. Check the resulting guidance against representative review findings and
   likely edge cases. Verify that a reader can discover the rule from the
   relevant directory, workflow, or skill catalog.
7. Report the canonical location, the findings consolidated, references
   updated, unresolved exceptions, and the validation performed.

## Output format

Use this structure unless the user requests another format:

```markdown
# Standard: [short name]

## Rule

[Normative rule]

## Scope and rationale

- Applies to: ...
- Rationale: ...
- Exceptions: None / ...

## Examples

- Correct: ...
- Incorrect: ...

## Canonical location

- [path]: [section]

## Consolidation

- Findings addressed: ...
- References updated: ...
- Contradictions remaining: None / ...

## Validation

- Searches or checks: ...
- Status: codified / needs a decision
```

## Boundaries

- Do not turn a single stylistic comment into a mandatory standard without
  evidence or an explicit decision.
- Do not scatter the same rule across `AGENTS.md`, harness guidance, skills,
  and README text. Link to the canonical rule instead.
- Do not silently weaken an existing security, accessibility, testing, or
  performance requirement while simplifying documentation.
- Do not edit code, rewrite history, or create an ADR or policy file unless the
  user explicitly requests the resulting change.
