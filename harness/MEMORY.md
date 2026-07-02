# Project Memory

> Persistent cross-session knowledge about this codebase. This file contains facts, conventions, and learned patterns that should survive across all AI agent sessions.

## Project Identity

**Name**: Personal Development Playground  
**Type**: React + TypeScript + Three.js showcase application  
**Purpose**: Personal development experiments with 3D graphics, authentication, and interactive pages  
**Target Platforms**: Desktop (≥1024px), Tablet (768-1023px), Mobile (<768px)

## Technology Stack

### Core

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Styling**: @linaria/react (zero-runtime CSS-in-JS)
- **3D Graphics**: Three.js + @react-three/fiber + @react-three/drei
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore

### Development

- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode

## Architecture Patterns

### Directory Structure

```
src/
├── app/           # Application shell (App.tsx, routes)
├── features/      # Feature modules (auth, home, photobook)
├── entities/      # Domain entities (user, photobook, admin)
├── shared/        # Shared code
│   ├── components/  # Reusable React components
│   ├── ui-kit/      # Design system components
│   ├── config/      # Configuration (Firebase)
│   ├── di/          # Dependency injection primitives (see below)
│   ├── styles/      # Global styles + theme
│   └── utils/       # Utility functions
├── widgets/       # Composite UI widgets
└── test/          # Test configuration
```

This follows **Feature-Sliced Design** principles: entities → features → widgets → app.

### Dependency Injection

`src/shared/di/` provides a lightweight, function-component-only DI pattern
(React Context — no class-based DI framework fits a hooks-only codebase):

- `createToken<T>(description)` — creates a `Token<T>` (identity + phantom type).
- `DIProvider` — mounted once at the app root (`src/app/App.tsx`), takes a
  `bindings: [Token, implementation][]` array.
- `useInjectable(token)` — resolves the bound implementation inside any
  component, avoiding prop drilling.

Convention: one token per use-case function, defined **in the same file as
the use case itself** (e.g. `src/entities/photobook/uploadPhoto.ts` exports
both `uploadPhoto` and `UploadPhotoToken`). Currently piloted only on the
`photobook`/`admin` entities — `entities/user` and the auth feature still use
plain imports and are not yet migrated.

### Import Conventions

**Always use `@/` path aliases**:

```ts
import { useAuth } from '@/features/auth/components/useAuth'
import { theme } from '@/shared/styles/theme'
```

**Never use relative imports** like `../../shared/utils`.

### Styling Conventions

**Linaria-only — No inline styles**:

```ts
// ✅ Correct: Component.styles.ts
import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Container = styled.div`
  padding: ${theme.spacing.md};

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
  }
`

// ❌ Wrong: inline styles
<div style={{ padding: '16px' }}>
```

**Theme**: Import `theme` as a plain JS object. No `ThemeProvider` needed.

### Responsive Breakpoints

| Breakpoint   | Width      | Context         |
| ------------ | ---------- | --------------- |
| Desktop      | ≥1024px    | Full experience |
| Tablet       | 768-1023px | Adapted layouts |
| Mobile       | <768px     | Mobile-first    |
| Small Mobile | <480px     | Compact spacing |

**Every component must be responsive** — test at all breakpoints.

## TypeScript Rules

1. **Strict mode enabled** — no `any`, no implicit `any`
2. **Explicit return types** for exported functions
3. **Interface over type** for object shapes (consistency)
4. **Enums for constants** when domain-specific

## File Naming Conventions

- **Components**: `ComponentName.tsx`
- **Styles**: `ComponentName.styles.ts`
- **Tests**: `ComponentName.test.tsx`
- **Utilities**: `camelCase.ts`
- **Constants**: `CONSTANT_CASE.ts`

## Component Structure

```ts
// 1. Imports
import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

// 2. Types
interface Props {
  title: string
}

// 3. Styles (in .styles.ts file)
export const Container = styled.div`...`

// 4. Component
export function ComponentName({ title }: Props) {
  // logic
  return <Container>{title}</Container>
}

// 5. Export from index.ts
export { ComponentName } from './ComponentName'
```

## Firebase Configuration

- **Auth**: `src/shared/config/firebase/auth.ts`
- **Firestore + Storage**: `src/shared/config/firebase/firebase.ts` (exports
  `db` and `storage`)
- **User Service**: `src/entities/user/userService.ts`
- **Photobook Services**: `src/entities/photobook/` (one file per use case:
  `uploadPhoto`, `subscribePhotos`, `deletePhoto`, `addComment`,
  `subscribeComments`, `deleteComment`, `subscribeReaction`,
  `toggleReaction`) — photos/comments/reactions are public-read, backing the
  shared `/photobook` community feed
- **Admin Service**: `src/entities/admin/checkIsAdmin.ts` — checks the
  `admins/{uid}` Firestore collection (client-read-only, never
  client-writable; admins are added manually via the Firebase console)

Auth is **optional** — the app is fully public, auth is for future features.
Reading the photobook feed is public; uploading/commenting/reacting requires
sign-in.

## Known Patterns

### Error Boundaries

All routes wrapped with `ErrorBoundary` component.

### Debug Tools

Gate development-only UI (Leva, debug panels) behind:

```ts
if (import.meta.env.DEV) {
  // dev-only code
}
```

### State Management

Currently using React Context for auth. No Redux/Zustand yet.

## Build Commands

```bash
pnpm dev          # Vite dev server
pnpm build        # Production build
pnpm test         # Vitest watch mode
pnpm test:run     # Vitest single run
pnpm lint         # ESLint check
pnpm format       # Prettier format
```

## Common Gotchas

1. **Linaria requires build-time extraction** — changes to styles may need dev server restart
2. **Three.js components need Canvas wrapper** — use `<Canvas>` from `@react-three/fiber`
3. **Firebase emulator not set up** — currently using live Firebase services
4. **No SSR** — Vite SPA mode only

## Decisions Log

| Date    | Decision                       | Rationale                                   |
| ------- | ------------------------------ | ------------------------------------------- |
| 2026-06 | Linaria over styled-components | Zero runtime, better performance            |
| 2026-06 | Feature-Sliced Design          | Scalable architecture for growing app       |
| 2026-06 | pnpm over npm/yarn             | Faster, disk-efficient, strict dependencies |
| 2026-06 | Vitest over Jest               | Native ESM support, faster than Jest        |

## Future Plans

- [ ] Add more 3D experiments (particle systems, shaders)
- [ ] Implement user profiles with Firestore
- [ ] Add Storybook for component documentation
- [ ] Set up Firebase emulators for local development
- [ ] Add E2E tests with Playwright

---

**Last Updated**: 2026-06-29  
**Memory Version**: 1.0.0
