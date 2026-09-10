---
name: to-spec
description: 'Turns an approved idea or conversation into a concise, implementation-ready specification with scope, behavior, constraints, and acceptance criteria.'
---

# To Spec

Convert an approved conversation or idea into a specification that another
agent or developer can implement without reconstructing the original context.

## Workflow

1. Identify the requested outcome and restate it in one sentence. Treat the
   latest approved user intent as authoritative; preserve explicit constraints
   and decisions from the conversation.
2. Separate the work into:
   - **In scope** — behavior required for this request.
   - **Out of scope** — adjacent work deliberately excluded.
   - **Open decisions** — only questions that block a correct implementation.
3. Describe observable behavior, including the happy path, relevant states,
   validation, errors, permissions, and edge cases. Do not invent product
   behavior; mark assumptions explicitly.
4. Capture technical constraints that affect implementation, such as existing
   architecture, APIs, accessibility, responsive behavior, security, testing,
   and performance requirements. Prefer repository conventions over new
   abstractions or dependencies.
5. Write independently verifiable acceptance criteria. Each criterion should
   describe a concrete observable result and, where useful, its condition or
   example.
6. End with a short implementation handoff: affected areas, suggested
   validation, assumptions, and any blocking open decisions. If no blocking
   decisions remain, state that the specification is ready for implementation.

## Output format

Use this structure unless the user requests another format:

```markdown
# [Feature or change name]

## Outcome

...

## Scope

### In scope

- ...

### Out of scope

- ...

## Behavior

### ...

...

## Constraints

- ...

## Acceptance criteria

- [ ] ...

## Implementation handoff

- Affected areas: ...
- Validation: ...
- Assumptions: ...
- Blocking decisions: none / ...
```

## Boundaries

- Do not write production code, create branches, or open tickets unless the
  user separately asks for implementation or project-management work.
- Do not turn vague preferences into mandatory requirements. Label inferred
  details as assumptions.
- Keep the specification concise: include details that change behavior,
  implementation, validation, or delivery scope; omit generic engineering
  advice.
- When a blocking decision is missing, ask the smallest number of focused
  questions before declaring the specification ready.
