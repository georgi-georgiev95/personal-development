---
name: ui-kit
description: 'Use when creating a new reusable UI-kit element in src/shared/ui-kit (for example: $ui-kit checkbox). Scaffolds a generic component with styles, stories, tests, and barrel exports.'
---

# UI-kit Component Scaffolding Skill

## Purpose

Create a new generic and reusable UI-kit component that follows this repository's conventions.

Input example:

- `/ui-kit checkbox`

Expected result example:

- `src/shared/ui-kit/Checkbox/Checkbox.tsx`
- `src/shared/ui-kit/Checkbox/Checkbox.styles.ts`
- `src/shared/ui-kit/Checkbox/Checkbox.stories.tsx`
- `src/shared/ui-kit/Checkbox/Checkbox.test.tsx`
- `src/shared/ui-kit/Checkbox/index.ts`
- update `src/shared/ui-kit/index.ts`

## Rules

1. Use `@linaria/react` styles in a dedicated `.styles.ts` file.
2. Never use inline styles in component implementation.
3. Use strict TypeScript types (no `any`).
4. Use `@/` import aliases for cross-folder imports.
5. Build generic API surfaces (variant/size/state where meaningful).
6. Ensure accessibility defaults (`aria-*`, semantic HTML, keyboard support).
7. Add Storybook stories under `UI-kit/<ComponentName>`.
8. Add Vitest tests for rendering, behavior, and key props.
9. Export from both local `index.ts` and `src/shared/ui-kit/index.ts`.

## Step-by-step Workflow

1. Parse the component name from the user input and convert it to PascalCase.
2. Create `src/shared/ui-kit/<PascalCase>/`.
3. Implement component + styles + stories + tests + local index.
4. Update `src/shared/ui-kit/index.ts` with a new export.
5. Run targeted verification:
   - `npm run test:run -- src/shared/ui-kit/<PascalCase>/<PascalCase>.test.tsx`
   - if needed, run `npm run typecheck`
6. Report created files and test result.

## Output Template

- Created: list of files
- Updated: list of files
- Verified: command(s) and pass/fail
- Notes: any assumptions or follow-up suggestions
