#!/usr/bin/env node

/**
 * Widget Generator for MVVM + Functional DI + @linaria/react Architecture
 *
 * Usage:
 *   npm run generate:widget <WidgetName>
 *   npm run generate:widget <WidgetName> --path=features/dashboard
 *
 * What it generates:
 *   <WidgetName>/
 *   ├── <WidgetName>.view.tsx        UI only — no business logic
 *   ├── <WidgetName>.viewmodel.ts    Factory function, receives EventBus
 *   ├── <WidgetName>.types.ts        State + Props interfaces
 *   ├── <WidgetName>.styles.ts       @linaria/react styled components
 *   ├── <WidgetName>.stories.tsx     Storybook stories
 *   ├── <WidgetName>.test.ts         Vitest unit tests
 *   └── index.ts                     Barrel exports
 *
 * After generating:
 *   1. Add a Symbol token in src/core/di/tokens.ts
 *   2. Bind the ViewModel in src/core/di/container.ts
 *   3. Add a WidgetCatalogueEntry in NavigationWidget.viewmodel.ts
 *   4. Register the component in src/pages/widgetRegistry.ts
 *   5. Add any new EventBus event types in src/core/event-bus/events.ts
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = process.argv.slice(2)
const widgetName = args[0]
const pathArg = args.find((arg) => arg.startsWith('--path='))
const customPath = pathArg ? pathArg.replace('--path=', '') : 'components'

if (!widgetName) {
  console.error('❌ Please provide a widget name')
  console.log('Usage: npm run generate:widget <WidgetName> [--path=<relative-src-path>]')
  process.exit(1)
}

if (!/^[A-Z][a-zA-Z0-9]*$/.test(widgetName)) {
  console.error('❌ Widget name must be in PascalCase (e.g., CounterWidget)')
  process.exit(1)
}

const srcDir = path.resolve(__dirname, '../src')
const widgetDir = path.join(srcDir, customPath, widgetName)

if (fs.existsSync(widgetDir)) {
  console.error(`❌ Widget "${widgetName}" already exists at ${widgetDir}`)
  process.exit(1)
}

const templates = {
  types:
`export interface ${widgetName}Props {
  // Add component props here
}

export interface ${widgetName}State {
  loading: boolean
  error: string | null
}
`,

  viewmodel:
`import { createViewModelStore } from '@/core/viewmodels'
import type { ViewModelStore } from '@/core/viewmodels'
import type { EventBus } from '@/core/event-bus'
import type { ${widgetName}State } from './${widgetName}.types'

const initialState: ${widgetName}State = {
  loading: false,
  error: null,
}

export interface ${widgetName}VM extends ViewModelStore<${widgetName}State> {
  // Add business logic methods here
}

export function create${widgetName}ViewModel(
  eventBus: EventBus
): ${widgetName}VM {
  const store = createViewModelStore<${widgetName}State>(initialState)

  return {
    ...store,
    // Add business logic methods below
    // Example: eventBus.emit('${widgetName.toLowerCase()}:action', { ... })
  }
}
`,

  styles:
`import { styled } from '@linaria/react'
import { theme } from '@/theme'

export const Container = styled.div\`
  display: flex;
  flex-direction: column;
  gap: \${theme.spacing.md};
  padding: \${theme.spacing.lg};
  background: \${theme.colors.cardBg};
  border-radius: \${theme.borderRadius};
  box-shadow: \${theme.boxShadow.sm};

  @media (max-width: 768px) {
    padding: \${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: \${theme.spacing.sm};
  }
\`

export const WidgetTitle = styled.h2\`
  margin: 0;
  font-size: \${theme.fontSizes.lg};
  color: \${theme.colors.primary};
  font-weight: 600;
\`
`,

  view:
`import React, { useEffect, useState } from 'react'
import { useViewModel } from '@/core/hooks'
import { TOKENS } from '@/core/di'
import type { ${widgetName}VM } from './${widgetName}.viewmodel'
import type { ${widgetName}State, ${widgetName}Props } from './${widgetName}.types'
import { Container, WidgetTitle } from './${widgetName}.styles'

export const ${widgetName}: React.FC<${widgetName}Props> = (_props) => {
  const vm = useViewModel<${widgetName}VM>(TOKENS.${widgetName}ViewModel)
  const [state, setLocalState] = useState<${widgetName}State>(vm.getState())

  useEffect(() => {
    const unsubscribe = vm.subscribe(() => {
      setLocalState({ ...vm.getState() })
    })
    return () => {
      unsubscribe()
      vm.dispose()
    }
  }, [vm])

  return (
    <Container>
      <WidgetTitle>${widgetName}</WidgetTitle>
      {state.loading && <span>Loading...</span>}
      {state.error && <span style={{ color: 'red' }}>{state.error}</span>}
    </Container>
  )
}
`,

  test:
`import { describe, it, expect, vi, beforeEach } from 'vitest'
import { create${widgetName}ViewModel } from './${widgetName}.viewmodel'
import type { ${widgetName}VM } from './${widgetName}.viewmodel'
import type { EventBus } from '@/core/event-bus'

const mockEmit = vi.fn()
const mockEventBus: EventBus = {
  on: vi.fn(),
  off: vi.fn(),
  emit: mockEmit,
} as unknown as EventBus

describe('${widgetName}ViewModel', () => {
  let vm: ${widgetName}VM

  beforeEach(() => {
    vi.clearAllMocks()
    vm = create${widgetName}ViewModel(mockEventBus)
  })

  it('has correct initial state', () => {
    expect(vm.getState()).toStrictEqual({
      loading: false,
      error: null,
    })
  })

  // TODO: add meaningful state transition tests
  // TODO: add EventBus emission tests
})
`,

  stories:
`import type { Meta, StoryObj } from '@storybook/react-vite'
import { ${widgetName} } from './${widgetName}.view'

const meta: Meta<typeof ${widgetName}> = {
  title: 'Widgets/${widgetName}',
  component: ${widgetName},
  parameters: { layout: 'centered' },
}

export default meta

type Story = StoryObj<typeof ${widgetName}>

export const Default: Story = {}
`,

  index:
`export { ${widgetName} } from './${widgetName}.view'
export { create${widgetName}ViewModel } from './${widgetName}.viewmodel'
export type { ${widgetName}VM } from './${widgetName}.viewmodel'
export type { ${widgetName}Props, ${widgetName}State } from './${widgetName}.types'
`,
}

fs.mkdirSync(widgetDir, { recursive: true })

const files = [
  { name: `${widgetName}.types.ts`, content: templates.types },
  { name: `${widgetName}.viewmodel.ts`, content: templates.viewmodel },
  { name: `${widgetName}.styles.ts`, content: templates.styles },
  { name: `${widgetName}.view.tsx`, content: templates.view },
  { name: `${widgetName}.test.ts`, content: templates.test },
  { name: `${widgetName}.stories.tsx`, content: templates.stories },
  { name: 'index.ts', content: templates.index },
]

files.forEach(({ name, content }) => {
  fs.writeFileSync(path.join(widgetDir, name), content)
  console.log(`  ✅ Created ${name}`)
})

console.log(`
✨ Widget "${widgetName}" scaffolded!
📁 Location: src/${customPath}/${widgetName}/

Next steps:
  1. Add token to src/core/di/tokens.ts
  2. Bind ViewModel factory in src/core/di/container.ts
  3. Add entry to WIDGET_CATALOGUE in NavigationWidget.viewmodel.ts
  4. Register component in src/pages/widgetRegistry.ts
  5. Add EventBus events in src/core/event-bus/events.ts (if needed)
`)
