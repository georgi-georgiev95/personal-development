---
name: handoff
description: 'Records task state, decisions, files, validation, blockers, and next steps so another agent or future session can continue safely.'
---

# Handoff

Create a truthful continuation record at a task boundary, especially before
changing sessions, pausing work, or handing implementation to another agent.

## Workflow

1. Reconstruct the current task from the latest user request and repository
   state. State the intended outcome and distinguish completed, in-progress,
   and not-started work.
2. Record the decisions that shaped the implementation, including assumptions,
   rejected alternatives, scope boundaries, and any user choices. Link to the
   relevant files, issues, or commits when available.
3. Inventory every relevant file as created, modified, inspected, or pending.
   Include the important symbol, section, or reason rather than listing files
   without context.
4. Record validation precisely: commands run, focused results, failures,
   warnings, and checks that have not been run. Never describe a check as
   passing when its result is unknown.
5. Describe blockers and external dependencies with the smallest action needed
   to unblock them. Separate a true blocker from a follow-up or improvement.
6. Write ordered next steps that a new agent can execute without rediscovering
   the context. Include the first command or file to inspect when useful.
7. Review the handoff for stale claims, missing paths, hidden uncommitted work,
   and secrets. Omit credentials and redact sensitive values.

## Output format

Use this structure unless the user requests another format:

```markdown
# Handoff: [task]

## Objective

- Outcome: ...
- Status: complete / in progress / blocked

## Current state

- Completed: ...
- In progress: ...
- Not started: ...

## Decisions and assumptions

- Decision: ...
- Assumption: ...
- Scope boundary: ...

## Files and references

- Created: `[path]` — [purpose]
- Modified: `[path]` — [relevant change]
- Inspected: `[path]` — [why it matters]
- References: [issue, PR, commit, or design link]

## Validation

- Passed: `[command]` — [result]
- Failed: `[command]` — [error or cause]
- Not run: `[command]` — [reason]

## Blockers and risks

- Blocker: None / [smallest unblocking action]
- Risk: ...

## Next steps

1. ...
2. ...
```

## Boundaries

- Do not claim completion, test coverage, or clean repository state without
  evidence from the current session.
- Do not hide unresolved decisions or uncommitted changes because they make
  the handoff less tidy.
- Do not include secrets, tokens, private keys, or sensitive user data; name
  the affected configuration without exposing its value.
- Do not create commits, branches, tickets, or external messages unless the
  user separately requests that work.
