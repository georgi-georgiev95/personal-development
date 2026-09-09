---
name: prototype
description: 'Builds focused, disposable prototypes to answer UI, state, architecture, or technical-feasibility questions before production implementation.'
---

# Prototype

Use this skill for a time-boxed spike whose purpose is learning, not shipping.
The prototype must answer a clearly stated question and remain easy to discard.

## Workflow

1. State one primary question and the evidence that would answer it. Record
   useful constraints, assumptions, and a small success criterion before
   writing code.
2. Choose the smallest surface that can produce that evidence. Prefer existing
   project dependencies and patterns; do not add production abstractions,
   broad refactors, or dependencies solely to make the prototype polished.
3. Keep prototype code isolated from production modules. Put temporary source
   under a clearly named prototype area, and do not export it through the
   application, shared barrels, routes, or public APIs unless the task
   explicitly requires an integrated experiment. Mark disposable files and
   avoid changing production configuration when a local harness is enough.
4. Implement only the behavior needed to test the question. For UI questions,
   cover the relevant interaction states and responsive behavior. For state or
   architecture questions, make data flow and boundaries visible. For
   feasibility questions, exercise the riskiest dependency or browser API
   directly.
5. Validate the hypothesis with the lightest meaningful check: a focused test,
   a browser interaction, a build/type check, a measured result, or a short
   comparison of alternatives. Do not claim feasibility from code that was not
   actually exercised.
6. Finish with a concise decision record containing the question, observed
   evidence, conclusion, limitations, and the recommended next step. State
   explicitly whether the prototype should be discarded, retained as a
   reference, or converted into a separate production ticket.

## Boundaries

- Do not silently turn prototype code into production code.
- Do not weaken authentication, validation, accessibility, or security in
  production paths to make a prototype work.
- Keep mock data, credentials, and external side effects local and obvious.
- Remove temporary files when the user asks for cleanup; otherwise list them
  clearly in the completion report.
- Follow repository conventions when the prototype touches application code:
  TypeScript strictness, `@/` imports, Linaria styling, responsive behavior,
  and lazy loading for heavy Three.js or Firestore code.

## Completion report

Report the question tested, files created or changed, validation performed,
the evidence and conclusion, known limitations, and the proposed next step.
