# Testing Guidelines

## Coverage Rule

**100% coverage is enforced** on business logic and utility code. The coverage check runs with `npm run coverage` and will fail if any metric drops below 100%.

## What to Test

Write tests for:

- **Business logic** — entity services, data transformations, validation rules
- **Utilities** — pure functions, helpers, formatters, parsers
- **Hooks** — custom React hooks that encapsulate logic (e.g., `useAuth`)
- **State management** — reducers, context providers, any logic that transforms state

## What NOT to Test

Do NOT write tests for:

- **UI rendering** — component output, styling, layout, visual appearance
- **Storybook stories** — stories are for visual documentation, not unit tests
- **Type definitions** — TypeScript types are checked by the compiler, not tests
- **Third-party code** — Firebase SDK, React, etc. Trust the library
- **Trivial getters/setters** — simple property access with no logic

## Test Style

- Tests must be **meaningful** — they verify behavior, not implementation
- Prefer testing **public APIs** over internal details
- Use **mocks** for external dependencies (Firebase, APIs, browser APIs)
- Tests should be **isolated** — no test should depend on another
- One `describe` per function/class, one `it` per behavior

## Coverage Scope

Coverage is collected only from:

- `src/entities/**` — business entities and services
- `src/shared/utils/**` — utility functions

Other directories (features, widgets, app, shared/components) are excluded from coverage enforcement because they contain UI code.

## Commands

```bash
npm run coverage    # run tests with coverage enforcement
npm run test:run    # run tests without coverage (faster feedback loop)
```
