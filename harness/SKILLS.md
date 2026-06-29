# Available Skills

> Capabilities and patterns for common tasks in this project. Load this file when the task requires scaffolding, complex setup, or domain-specific knowledge.

## When to Load This File

**Load when**:

- Creating new features or modules
- Setting up 3D experiments with Three.js
- Scaffolding components with styles and tests
- Firebase integration tasks
- Complex routing or auth flows

**Skip when**:

- Simple file edits
- Bug fixes in existing code
- Documentation updates

---

## Skill: Component Scaffolding

**Trigger**: User asks to create a new React component

**Pattern**:

```bash
# Use the generator script
node scripts/generate-component.js ComponentName

# Or manually create:
# 1. ComponentName.tsx
# 2. ComponentName.styles.ts
# 3. ComponentName.test.tsx
# 4. index.ts (export)
```

**Template Structure**:

```ts
// ComponentName.tsx
import { Container } from './ComponentName.styles'

interface ComponentNameProps {
  // props
}

export function ComponentName({ }: ComponentNameProps) {
  return <Container>Content</Container>
}

// ComponentName.styles.ts
import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Container = styled.div`
  /* styles */
`

// index.ts
export { ComponentName } from './ComponentName'
export type { ComponentNameProps } from './ComponentName'
```

**Checklist**:

- [ ] TypeScript interface for props
- [ ] Styles in separate `.styles.ts` file
- [ ] Export from `index.ts`
- [ ] Responsive styles (mobile, tablet, desktop)
- [ ] Test file created (even if minimal)

---

## Skill: Three.js Scene Setup

**Trigger**: User wants to add a new 3D experiment or visual element

**Pattern**:

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

export function ThreeScene() {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Your 3D content */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}
```

**Common Patterns**:

- **Camera**: Use `PerspectiveCamera` from drei, set `makeDefault`
- **Controls**: `OrbitControls` for interactive scenes, omit for fixed views
- **Lighting**: Always include `ambientLight` + `pointLight` or `directionalLight`
- **Performance**: Use `<Suspense>` for loading 3D assets

**Checklist**:

- [ ] Canvas wrapper present
- [ ] Camera configured
- [ ] Basic lighting (ambient + directional/point)
- [ ] Controls added if interactive
- [ ] Responsive sizing (Canvas takes parent dimensions)

---

## Skill: Feature Module Creation

**Trigger**: User wants to add a new feature (e.g., "Create a profile feature")

**Feature-Sliced Design Structure**:

```
src/features/{feature-name}/
├── components/       # Feature-specific components
│   └── FeatureContext.tsx
├── pages/            # Feature pages
│   └── FeaturePage.tsx
└── index.ts          # Feature exports
```

**Process**:

1. Create feature directory: `src/features/{feature-name}`
2. Add page component: `pages/{Feature}Page.tsx`
3. Add page styles: `pages/{Feature}Page.styles.ts`
4. Add to routes: `src/app/routes.tsx`
5. (Optional) Add context provider if needed
6. Export from `index.ts`

**Example**: Adding a "Profile" feature

```ts
// src/features/profile/pages/ProfilePage.tsx
// src/features/profile/pages/ProfilePage.styles.ts
// src/features/profile/components/ProfileContext.tsx
// src/features/profile/index.ts

// src/app/routes.tsx
import { ProfilePage } from '@/features/profile'

// Add route
{ path: '/profile', element: <ProfilePage /> }
```

---

## Skill: Firebase Integration

**Trigger**: User needs to add Firebase auth or Firestore functionality

### Firebase Auth Pattern

```ts
import { auth } from '@/shared/config/firebase/auth'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'

// Sign in
await signInWithEmailAndPassword(auth, email, password)

// Sign up
await createUserWithEmailAndPassword(auth, email, password)

// Sign out
await signOut(auth)
```

### Firestore Pattern

```ts
import { db } from '@/shared/config/firebase/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

// Read
const docRef = doc(db, 'users', userId)
const docSnap = await getDoc(docRef)
const data = docSnap.data()

// Write
await setDoc(doc(db, 'users', userId), { name, email })

// Update
await updateDoc(doc(db, 'users', userId), { name: 'New Name' })
```

**Error Handling**:

```ts
import { getAuthErrorMessage } from '@/shared/utils/authErrors'

try {
  await signInWithEmailAndPassword(auth, email, password)
} catch (error) {
  const message = getAuthErrorMessage(error)
  console.error(message)
}
```

---

## Skill: Responsive Layout Design

**Trigger**: Creating a new page or complex layout

**Mobile-First Approach**:

```ts
import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Layout = styled.div`
  /* Mobile first (default) */
  padding: ${theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  /* Tablet (768px+) */
  @media (min-width: 768px) {
    padding: ${theme.spacing.md};
    flex-direction: row;
    gap: ${theme.spacing.md};
  }

  /* Desktop (1024px+) */
  @media (min-width: 1024px) {
    padding: ${theme.spacing.lg};
    max-width: 1200px;
    margin: 0 auto;
  }
`
```

**Common Responsive Patterns**:

- **Spacing**: `sm` (mobile) → `md` (tablet) → `lg` (desktop)
- **Layout**: `column` (mobile) → `row` (tablet/desktop)
- **Typography**: `16px` (mobile) → `18px` (desktop)
- **Grid**: `1 column` (mobile) → `2 columns` (tablet) → `3 columns` (desktop)

---

## Skill: Testing Setup

**Trigger**: Adding tests for a new component or feature

### Component Test Pattern

```ts
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const { user } = render(<ComponentName />)
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Result')).toBeInTheDocument()
  })
})
```

### Service Test Pattern

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { serviceName } from './serviceName'

describe('serviceName', () => {
  beforeEach(() => {
    // Setup
  })

  it('does something correctly', () => {
    const result = serviceName.method()
    expect(result).toBe(expected)
  })
})
```

**Run Tests**:

```bash
pnpm test              # Watch mode
pnpm test:run          # Single run
pnpm test ComponentName  # Run specific test
```

---

## Skill: UI Kit Component Pattern

**Trigger**: Creating a design system component in `src/shared/ui-kit/`

**Requirements**:

1. **Component**: Fully typed, accessible
2. **Styles**: Linaria with theme
3. **Tests**: RTL tests for behavior
4. **Stories**: Storybook story (optional but recommended)
5. **Export**: From `src/shared/ui-kit/index.ts`

**Example**: Button component

```
src/shared/ui-kit/Button/
├── Button.tsx
├── Button.styles.ts
├── Button.test.tsx
├── Button.stories.ts  (optional)
└── index.ts
```

---

## Skill: Debug Tools Integration

**Trigger**: Adding Leva controls or debug panels to 3D experiments

**Pattern**:

```tsx
import { useControls } from 'leva'

export function ExperimentComponent() {
  const { color, scale } = useControls({
    color: '#ff6347',
    scale: { value: 1, min: 0.5, max: 2, step: 0.1 },
  })

  return (
    <mesh scale={scale}>
      <meshStandardMaterial color={color} />
    </mesh>
  )
}
```

**Gate Behind Dev Mode**:

```tsx
{
  import.meta.env.DEV && <LevaPanel />
}
```

---

## Future Skills (Planned)

- [ ] E2E testing with Playwright
- [ ] Storybook setup and story patterns
- [ ] Firebase emulator configuration
- [ ] Performance optimization patterns
- [ ] Advanced shader integration

---

**Last Updated**: 2026-06-29  
**Version**: 1.0.0
