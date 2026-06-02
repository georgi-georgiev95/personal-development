# Copilot / AI Agent Instructions — Personal Development Playground

## What This App Is

A **personal development playground** — a showcase app with 3D graphics experiments, authentication, and interactive pages. Built with React, TypeScript, Vite, and Three.js.

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
│   ├── home/               # Home page with 3D experiments
│   └── robot/              # Robot showcase with 3D model
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
6. Gate debug tools (Leva) behind `import.meta.env.DEV`

---

## Build & Dev Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc + Vite build
npm run test         # Vitest watch
npm run test:run     # Vitest single run
npm run lint         # ESLint
npm run format       # Prettier
```

---

## Auth Infrastructure

- Firebase Auth: `src/shared/config/firebase/auth.ts`
- `AuthProvider` + `AuthContext` — provides `{ user, loading, signOut }`
- `useAuth()` — consume auth state in components
- `userService.ts` — Firestore CRUD for user profiles
- Auth is **optional** — playground is fully public

## Routing

| Path        | Component             | Auth required |
| ----------- | --------------------- | ------------- |
| `/`         | Redirects to `/robot` | No            |
| `/home`     | `HomePage`            | No            |
| `/login`    | `LoginPage`           | No            |
| `/register` | `RegisterPage`        | No            |
| `/robot`    | `OptimusPrime`        | No            |

(End of repo-specific guidance.)
