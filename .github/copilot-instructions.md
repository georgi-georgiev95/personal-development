# Copilot / AI Agent Instructions — Widget Playground

## What This App Is

A **responsive widget playground** — a grid canvas where users can mount, arrange, and resize independent MVVM widgets. Each widget is a self-contained unit you can drag into any other project. Authentication is present but optional (auth unlocks user-profile widgets).

**Target platforms:** Desktop (>=1024px), Tablet (768-1023px), Mobile (<768px) — every widget and layout must be responsive.

---

## Architecture: MVVM + InversifyJS DI + EventBus

```
View  ──────► ViewModel ──────► EventBus ──────► Other ViewModels
(React)     (InversifyJS)    (Singleton)       (via typed events)
```

- **View** (`.view.tsx`) — UI only, subscribes to ViewModel state
- **ViewModel** (`.viewmodel.ts`) — all logic, `@injectable()`, injects `EventBus`
- **EventBus** — the only legal channel for cross-widget communication
- **DI Container** — InversifyJS `Container`, tokens in `src/core/di/tokens.ts`
- **Styling** — `@linaria/react` (zero-runtime CSS-in-JS, build-time extraction)

---

## Folder Structure

```
src/
├── core/
│   ├── di/
│   │   ├── container.ts          # InversifyJS Container + all bindings
│   │   ├── tokens.ts             # Every Symbol token lives here
│   │   └── index.ts
│   ├── event-bus/
│   │   ├── EventBus.ts           # @injectable singleton
│   │   ├── events.ts             # global WidgetEvents interface
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useViewModel.ts       # container.get<T>(token)
│   │   └── index.ts
│   └── viewmodels/
│       ├── BaseViewModel.ts      # setState + subscribe
│       └── index.ts
├── components/
│   └── <WidgetName>/
│       ├── <WidgetName>.view.tsx
│       ├── <WidgetName>.viewmodel.ts
│       ├── <WidgetName>.types.ts
│       ├── <WidgetName>.styles.ts     # @linaria/react styled
│       ├── <WidgetName>.stories.tsx   # Storybook
│       ├── <WidgetName>.test.ts       # Vitest
│       └── index.ts
├── pages/
│   ├── PlaygroundPage.tsx        # public CSS Grid canvas
│   ├── PlaygroundPage.styles.ts
│   ├── widgetRegistry.ts         # Record<widgetId, React.ComponentType>
│   ├── LoginPage.tsx / .styled.ts
│   └── RegisterPage.tsx / .styled.ts
├── services/
│   └── userService.ts
├── firebase/
│   ├── auth.ts
│   └── firebase.ts
├── theme.ts                      # JS object — import directly, no ThemeProvider
├── App.tsx / App.styles.ts
└── main.tsx
```

---

## Creating a New Widget

**Always** use the generator:

```bash
npm run generate:widget <WidgetName>
npm run generate:widget <WidgetName> --path=features/dashboard
```

After generating, complete 5 manual steps (printed by the script):

1. Add token to `src/core/di/tokens.ts`:
   `<WidgetName>ViewModel: Symbol.for('<WidgetName>ViewModel')`
2. Bind in `src/core/di/container.ts` (inTransientScope)
3. Add `WidgetCatalogueEntry` to `WIDGET_CATALOGUE` in `NavigationWidget.viewmodel.ts`
4. Register component in `src/pages/widgetRegistry.ts`
5. Add new event types in `src/core/event-bus/events.ts`

---

## ViewModel Pattern

```ts
import { injectable, inject } from 'inversify'
import { BaseViewModel } from '@/core/viewmodels'
import { EventBus } from '@/core/event-bus'
import { TOKENS } from '@/core/di'
import type { MyWidgetState } from './MyWidget.types'

@injectable()
export class MyWidgetViewModel extends BaseViewModel<MyWidgetState> {
  private readonly eventBus: EventBus

  constructor(@inject(TOKENS.EventBus) eventBus: EventBus) {
    super({ loading: false, error: null })
    this.eventBus = eventBus
  }

  doSomething(): void {
    this.setState({ loading: true })
    this.eventBus.emit('mywidget:action', { payload: 'value' })
  }

  override dispose(): void {
    super.dispose()
  }
}
```

## View Pattern (UI Only)

```tsx
import React, { useEffect, useState } from 'react'
import { useViewModel } from '@/core/hooks'
import { TOKENS } from '@/core/di'

export const MyWidget: React.FC = () => {
  const viewModel = useViewModel<MyWidgetViewModel>(TOKENS.MyWidgetViewModel)
  const [state, setLocalState] = useState<MyWidgetState>(viewModel.state)

  useEffect(() => {
    const unsubscribe = viewModel.subscribe(() =>
      setLocalState({ ...viewModel.state })
    )
    return () => {
      unsubscribe()
      viewModel.dispose()
    }
  }, [viewModel])

  return <Container>...</Container>
}
```

---

## EventBus Contract

Widgets must **never import each other**. All cross-widget communication via EventBus only.

### Adding a new event — `src/core/event-bus/events.ts`

```ts
'mywidget:action': { payload: string }
```

### Emitting

```ts
this.eventBus.emit('mywidget:action', { payload: 'hello' })
```

### Subscribing

```ts
const off = this.eventBus.on('profile:updated', (data) => {
  this.setState({ username: data.displayName })
})
// Call off() in dispose()
```

Event naming: `<namespace>:<verb>` — e.g. `profile:updated`, `navigation:widget-added`.

---

## Styling with @linaria/react

Zero-runtime CSS-in-JS — extracted to static CSS at build time.

```ts
import { styled } from '@linaria/react'
import { css } from '@linaria/core'
import { theme } from '@/theme'

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

**No ThemeProvider.** Import `theme` as a plain JS object.

### Responsive breakpoints (required in every widget)

| Breakpoint | Context                               |
| ---------- | ------------------------------------- |
| >=1024px   | Desktop — multi-column, full features |
| 768-1023px | Tablet — 2 columns                    |
| <768px     | Mobile — single column                |
| <480px     | Small mobile — compact, simplified    |

---

## InversifyJS DI

- Tokens: `src/core/di/tokens.ts` — `Symbol.for(...)` values only
- Bindings: `src/core/di/container.ts`
- Widget ViewModels: `inTransientScope()` — new instance per component mount
- `EventBus`: `inSingletonScope()` — shared across entire app
- Inject with `@inject(TOKENS.Token)` in constructor parameters

---

## Storybook

Every widget has a `.stories.tsx` with a local test `Container`:

```tsx
const mockEventBus: EventBus = {
  on: () => () => undefined,
  off: () => undefined,
  emit: () => undefined,
} as unknown as EventBus

const storyContainer = new Container()
storyContainer.bind<EventBus>(TOKENS.EventBus).toConstantValue(mockEventBus)
storyContainer
  .bind<MyViewModel>(TOKENS.MyViewModel)
  .to(MyViewModel)
  .inTransientScope()
```

---

## Testing

- Test `.viewmodel.ts` directly — no React rendering needed for logic
- Mock `EventBus` with `vi.fn()`
- Cover: initial state, state transitions, EventBus emissions, error cases

---

## Import Conventions

```ts
// Always use @/ aliases
import { useViewModel } from '@/core/hooks'
import { TOKENS } from '@/core/di'
import { theme } from '@/theme'
```

---

## Key Rules

1. No business logic in Views
2. No cross-widget imports — EventBus only
3. Always use the generator
4. No inline styles — `.styles.ts` with `@linaria/react`
5. Strong typing everywhere — no `any`
6. Every widget is responsive (all 4 breakpoints)
7. Every widget has tests

---

## Build & Dev Commands

```bash
npm run dev              # Vite dev server
npm run build            # tsc + Vite build
npm run test             # Vitest watch
npm run test:run         # Vitest single run
npm run lint             # ESLint
npm run generate:widget  # Scaffold a new widget
npx storybook dev        # Storybook dev server
```

---

## Auth Infrastructure

- Firebase Auth: `src/firebase/auth.ts`
- `AuthProvider` + `AuthContext` — provides `{ user: User | null, loading: boolean }`
- `useAuth()` — consume auth state in views
- `userService.ts` — Firestore CRUD for user profiles
- Auth is **optional** — no route guards, playground is fully public

## Routing

| Path        | Component        | Auth required |
| ----------- | ---------------- | ------------- |
| `/`         | `PlaygroundPage` | No            |
| `/login`    | `LoginPage`      | No            |
| `/register` | `RegisterPage`   | No            |

(End of repo-specific guidance.)
