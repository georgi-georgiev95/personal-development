# Tool Usage Patterns

> Guidance for build tools, package management, testing, and deployment workflows. Load this file when tasks involve tooling rather than code.

## When to Load This File

**Load when**:

- Installing or removing dependencies
- Running builds or dev servers
- Debugging build/type errors
- Configuring linters, formatters, or bundlers
- Deployment or CI/CD tasks

**Skip when**:

- Writing component code
- Editing existing features
- Documentation updates

---

## Package Management (pnpm)

### Why pnpm?

- **Faster** than npm/yarn
- **Disk efficient** (content-addressable storage)
- **Strict** dependency resolution (no phantom dependencies)

### Common Commands

```bash
# Install dependencies
pnpm install

# Add dependency
pnpm add package-name
pnpm add -D package-name  # Dev dependency

# Remove dependency
pnpm remove package-name

# Update dependencies
pnpm update
pnpm update package-name  # Specific package

# Run scripts
pnpm dev
pnpm build
pnpm test
```

### Gotchas

- **Workspace mode enabled** (`pnpm-workspace.yaml` exists)
- **No hoisting by default** — if a package isn't in `package.json`, you can't import it
- **Lockfile**: `pnpm-lock.yaml` — commit this to git

---

## Development Server (Vite)

### Start Dev Server

```bash
pnpm dev
# Runs on http://localhost:5173
```

### How It Works

- **Fast HMR**: Changes reflect instantly (no full reload)
- **Linaria limitation**: Style changes may need manual refresh
- **Port conflict**: If 5173 is taken, Vite picks next available port

### Environment Variables

```bash
# .env.local (create if needed)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
```

Access in code:

```ts
import.meta.env.VITE_FIREBASE_API_KEY
```

### Dev Server Restart Needed When:

- Changing Vite config (`vite.config.ts`)
- Changing TypeScript config (`tsconfig.json`)
- Adding/removing dependencies
- Linaria styles not updating (rare, but happens)

---

## Build System (Vite + TypeScript)

### Production Build

```bash
pnpm build
# Output: dist/
```

**Build Steps**:

1. TypeScript compilation (`tsc`) — type checking only
2. Vite build — bundling, minification, Linaria extraction
3. Output: `dist/index.html` + assets

### Preview Production Build

```bash
pnpm preview
# Serves dist/ folder locally
```

### Build Errors

**Type errors**:

```bash
# Check types without building
pnpm exec tsc --noEmit
```

**Linaria errors** (rare):

```bash
# Clear Vite cache
rm -rf node_modules/.vite
pnpm dev
```

**Import errors**:

- Check that path aliases (`@/`) are in both `vite.config.ts` and `tsconfig.json`

---

## Testing (Vitest + React Testing Library)

### Run Tests

```bash
pnpm test        # Watch mode (interactive)
pnpm test:run    # Single run (CI mode)
```

### Run Specific Tests

```bash
pnpm test ComponentName      # File name pattern
pnpm test path/to/file.test.tsx  # Exact file
```

### Test File Patterns

- `*.test.ts` — Unit tests
- `*.test.tsx` — Component tests

### Coverage

```bash
pnpm test:run --coverage
# Output: coverage/ directory
```

### Common Testing Utilities

```ts
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

// Setup user interactions
const user = userEvent.setup()

// Render component
render(<MyComponent />)

// Query elements
screen.getByText('Hello')
screen.getByRole('button')
screen.queryByText('Maybe exists')  // null if not found

// User interactions
await user.click(screen.getByRole('button'))
await user.type(screen.getByRole('textbox'), 'Hello')

// Async assertions
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// Mock functions
const mockFn = vi.fn()
```

### Test Setup

- Global setup: `src/test/setup.ts`
- Config: `vitest.config.ts`

---

## Linting (ESLint)

### Run Linter

```bash
pnpm lint
# Checks all .ts/.tsx files
```

### Auto-Fix

```bash
pnpm lint --fix
```

### Config

- `eslint.config.js` — ESLint 9 flat config
- Includes: TypeScript, React, React Hooks rules

### Common Lint Errors

- **`any` type**: Not allowed in strict mode
- **Unused variables**: Prefix with `_` to ignore: `_unusedVar`
- **Missing return type**: Add explicit return type to exported functions
- **Hook dependencies**: ESLint enforces exhaustive deps for `useEffect`, `useMemo`, etc.

---

## Formatting (Prettier)

### Format Code

```bash
pnpm format
# Formats all files
```

### Prettier Config

Currently using Prettier defaults (no custom config).

### Editor Integration

Recommended: Enable "Format on Save" in VS Code.

---

## TypeScript Type Checking

### Check Types

```bash
pnpm exec tsc --noEmit
# Type-check without building
```

### Config Files

- `tsconfig.json` — Base config
- `tsconfig.app.json` — App-specific (extends base)
- `tsconfig.node.json` — Node scripts (Vite config, etc.)

### Path Aliases

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Must also be in `vite.config.ts`:

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

### Common Type Errors

- **Cannot find module `@/...`**: Check `paths` in `tsconfig.json` and `alias` in `vite.config.ts`
- **Type `any` is not allowed**: Add explicit type
- **Property does not exist**: Check interface/type definitions

---

## Firebase Tools (Future)

### Emulators (Not Set Up Yet)

```bash
# When configured:
firebase emulators:start
```

### Deploy (Future)

```bash
firebase deploy --only hosting
```

---

## Git Workflow

### Branch Strategy

Currently: Direct commits to `main` (personal project)

### Commit Messages

Follow conventional commits:

```
feat: Add 3D particle system
fix: Resolve responsive layout issue on mobile
docs: Update harness documentation
refactor: Simplify auth context logic
test: Add tests for Button component
```

---

## Debugging Tools

### Browser DevTools

- **React DevTools**: Inspect component tree
- **Console**: Check for errors, warnings
- **Network**: Debug Firebase API calls

### Vite Debug

```bash
DEBUG=vite:* pnpm dev
# Verbose Vite logging
```

### TypeScript Compiler Debug

```bash
pnpm exec tsc --noEmit --explainFiles
# Shows which files are included in compilation
```

---

## Common Workflows

### Adding a New Dependency

```bash
pnpm add package-name
# Restart dev server if it's a build-time dependency
```

### Upgrading Dependencies

```bash
pnpm update                    # Update all
pnpm update package-name       # Update specific
pnpm outdated                  # Check for outdated packages
```

### Clean Install

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Pre-Deployment Checklist

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm format` runs clean
- [ ] `pnpm test:run` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm preview` and manually test
- [ ] No console errors in browser

### Before Creating a PR (MANDATORY, see harness/GUARDRAILS.md)

Run in order, every time, before opening a PR:

```bash
pnpm lint
pnpm typecheck
pnpm format
pnpm build
```

All four must be green. A failure here means CI will fail and the deploy
will fail — fix it locally first, then re-run the full sequence.

---

**Last Updated**: 2026-06-29  
**Version**: 1.0.0
