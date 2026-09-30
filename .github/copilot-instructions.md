# Copilot / AI Agent Instructions — AI Delivery Lab

## What This App Is

An AI Delivery Lab product with a deterministic workflow demo and optional authentication. Built with React, TypeScript, and Vite.

**Target platforms:** Desktop (>=1024px), Tablet (768-1023px), Mobile (<768px).

---

## Architecture: React + TypeScript + Linaria

```
src/
├── app/                    # App shell (App, routes)
│   ├── App.tsx
│   ├── App.styles.ts
│   ├── routes.tsx
│   └── routes.styles.ts
├── features/               # Feature modules
│   ├── auth/               # Authentication (Login, Register, AuthProvider)
│   └── home/               # AI Delivery Lab product entry
├── shared/                 # Shared code
│   ├── components/         # Reusable components (Navigation, ErrorBoundary)
│   ├── config/             # Firebase config
│   ├── services/           # API/services (userService)
│   ├── styles/             # Global styles + theme
│   └── utils/              # Utility functions
├── main.tsx                # Entry point
└── test/                   # Test setup
```

---

## Styling with @linaria/react

Zero-runtime CSS-in-JS — extracted to static CSS at build time.

```ts
import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Container = styled.div`
  padding: ${theme.spacing.md};

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
  }
  @media (max-width: 480px) {
    padding: ${theme.spacing.xs};
  }
`
```

**No ThemeProvider.** Import `theme` as a plain JS object. **No inline styles** — always use `.styles.ts` files.

---

## Responsive Breakpoints

| Breakpoint | Context      |
| ---------- | ------------ |
| >=1024px   | Desktop      |
| 768-1023px | Tablet       |
| <768px     | Mobile       |
| <480px     | Small mobile |

---

## Import Conventions

```ts
// Always use @/ aliases
import { useAuth } from '@/features/auth/components/useAuth'
import { theme } from '@/shared/styles/theme'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
```

---

## Key Rules

1. No inline styles — `.styles.ts` with `@linaria/react`
2. Strong typing everywhere — no `any`
3. Every page/component is responsive
4. Use `@/` path aliases for all imports
5. Wrap routes with `ErrorBoundary`
6. Gate development-only debug tools behind `import.meta.env.DEV`

---

## Build & Dev Commands

```bash
pnpm dev             # Vite dev server
pnpm build           # tsc + Vite build
pnpm test            # Vitest watch
pnpm test:run        # Vitest single run
pnpm lint            # ESLint
pnpm format          # Prettier
```

---

## Auth Infrastructure

- Firebase Auth: `src/shared/config/firebase/auth.ts`
- `AuthProvider` + `AuthContext` — provides `{ user, loading, signOut }`
- `useAuth()` — consume auth state in components
- `userService.ts` — Firestore CRUD for user profiles
- Auth is optional; the product entry and demo are public

## Routing

| Path        | Component      | Auth required |
| ----------- | -------------- | ------------- |
| `/`         | `HomePage`     | No            |
| `/login`    | `LoginPage`    | No            |
| `/register` | `RegisterPage` | No            |

---

## Harness Integration

This project includes a **universal AI agent harness** in the `harness/` directory. The harness provides structured context following [Harness Engineering Guide](https://harness-guide.com/) principles.

**Key Harness Files** (load in order):

1. `harness/GUARDRAILS.md` — Agent identity, permissions, constraints (ALWAYS LOAD FIRST)
2. `harness/CONTEXT.md` — Context assembly rules, token budgeting
3. `harness/MEMORY.md` — Project knowledge, conventions, architecture
4. `harness/SKILLS.md` — Scaffolding patterns (load on demand)
5. `harness/TOOLS.md` — Build/test workflows (load on demand)

**Quick Reference**: See `harness/QUICKSTART.md` for usage examples.

(End of repo-specific guidance.)
