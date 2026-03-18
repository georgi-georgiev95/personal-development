# Copilot / AI Agent Instructions — personal-development

Purpose: give actionable, repository-specific guidance so an AI coding agent can be productive immediately.

## Architecture Overview (MVVM + DI)

This project follows the **MVVM (Model-View-ViewModel)** pattern with **Dependency Injection**:

- **View** (`.view.tsx`): UI only, no business logic. Renders state from ViewModel.
- **ViewModel** (`.viewmodel.ts`): All business logic, state management, API calls. Injectable via tsyringe.
- **Model**: Data types and services in `src/services/`.
- **DI Container**: tsyringe for dependency injection (`src/core/di/`).

### Folder Structure

```
src/
├── core/               # Framework infrastructure
│   ├── di/             # DI container setup
│   ├── hooks/          # useViewModel hook
│   └── viewmodels/     # BaseViewModel class
├── components/         # Independent, reusable MVVM components
│   └── ComponentName/
│       ├── ComponentName.view.tsx
│       ├── ComponentName.viewmodel.ts
│       ├── ComponentName.types.ts
│       ├── ComponentName.styles.ts
│       └── index.ts
├── pages/              # Route pages (compose components)
├── services/           # Firestore/API services
├── firebase/           # Firebase config
└── theme.ts            # Styled-components theme
```

## Component Generator

Always use the generator to create new components:

```bash
npm run generate <ComponentName>
npm run generate <ComponentName> --path=features/dashboard
```

This scaffolds:

- `ComponentName.view.tsx` — UI component (no logic)
- `ComponentName.viewmodel.ts` — Business logic class with `@injectable()`
- `ComponentName.types.ts` — Props and State interfaces
- `ComponentName.styles.ts` — Styled components
- `index.ts` — Barrel exports

## Import Conventions

Use path aliases (`@/`) for all imports — never use deep relative paths:

```tsx
// ✅ Correct
import { QuoteCard } from '@/components/QuoteCard'
import { useViewModel } from '@/core/hooks'
import { theme } from '@/theme'

// ❌ Wrong
import { QuoteCard } from '../../../components/QuoteCard'
```

## MVVM Patterns

### ViewModel Pattern

```ts
import { injectable } from 'tsyringe'
import { BaseViewModel } from '@/core/viewmodels'
import type { MyState } from './My.types'

@injectable()
export class MyViewModel extends BaseViewModel<MyState> {
  constructor() {
    super({ loading: false, data: null })
  }

  async fetchData(): Promise<void> {
    this.setState({ loading: true })
    // Business logic here
    this.setState({ loading: false, data: result })
  }
}
```

### View Pattern (UI Only)

```tsx
import { useViewModel } from '@/core/hooks'
import { MyViewModel } from './My.viewmodel'

export const MyComponent: React.FC<Props> = () => {
  const viewModel = useViewModel(MyViewModel)
  const [state, setState] = useState(viewModel.state)

  useEffect(() => {
    const unsub = viewModel.subscribe(() => setState({ ...viewModel.state }))
    viewModel.fetchData()
    return unsub
  }, [viewModel])

  // UI only - render state, call viewModel methods on events
  return <Container>{state.loading ? 'Loading...' : state.data}</Container>
}
```

## Key Rules

1. **No business logic in Views** — all logic goes in ViewModel
2. **Components must be independent** — drag-and-drop ready for other projects
3. **Always use generator** — `npm run generate ComponentName`
4. **Use @/ imports** — no relative imports beyond parent
5. **Styles in .styles.ts** — import `theme` directly, no inline styles

## Styling

- Use styled-components with `theme` import
- Create `.styles.ts` file for each component
- Responsive breakpoints: 768px (tablet), 480px (mobile)

```ts
import styled from 'styled-components'
import { theme } from '@/theme'

export const Container = styled.div`
  padding: ${theme.spacing.md};
  background: ${theme.colors.navbar};

  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
  }
`
```

## Build & Dev Commands

```bash
npm run dev       # Start dev server
npm run build     # TypeScript check + Vite build
npm run generate  # Create new MVVM component
npm run lint      # ESLint
npm run format    # Prettier
```

## Firebase Integration

- Auth: `src/firebase/auth.ts`, wrapped by `AuthProvider`
- Firestore: `src/firebase/firebase.ts`, helpers in `src/services/userService.ts`
- Profile photos stored as base64 in Firestore (no Storage)

## Providers (in App.tsx order)

1. `ThemeProvider` — styled-components theme
2. `AuthProvider` — Firebase auth state
3. `ProfileProvider` — User profile/photo state

---

(End of repo-specific guidance.)
