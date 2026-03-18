#!/usr/bin/env node

/**
 * Component Generator for MVVM Architecture
 * 
 * Usage: node scripts/generate-component.js <ComponentName> [--path=<path>]
 * 
 * Example:
 *   node scripts/generate-component.js UserCard
 *   node scripts/generate-component.js UserCard --path=features/user
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = process.argv.slice(2)
const componentName = args[0]
const pathArg = args.find(arg => arg.startsWith('--path='))
const customPath = pathArg ? pathArg.replace('--path=', '') : 'components'

if (!componentName) {
  console.error('❌ Please provide a component name')
  console.log('Usage: node scripts/generate-component.js <ComponentName> [--path=<path>]')
  process.exit(1)
}

// Validate component name (PascalCase)
if (!/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
  console.error('❌ Component name must be in PascalCase (e.g., UserCard)')
  process.exit(1)
}

const srcDir = path.resolve(__dirname, '../src')
const componentDir = path.join(srcDir, customPath, componentName)

// Check if component already exists
if (fs.existsSync(componentDir)) {
  console.error(`❌ Component ${componentName} already exists at ${componentDir}`)
  process.exit(1)
}

// Templates
const templates = {
  // View (UI Component)
  view: `import React from 'react'
import { useViewModel } from '@/core/hooks'
import { ${componentName}ViewModel } from './${componentName}.viewmodel'
import { Container } from './${componentName}.styles'
import type { ${componentName}Props } from './${componentName}.types'

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  const viewModel = useViewModel(${componentName}ViewModel)

  return (
    <Container>
      {/* UI only - no business logic */}
      <div>${componentName} Component</div>
    </Container>
  )
}
`,

  // ViewModel (Business Logic)
  viewmodel: `import { injectable } from 'tsyringe'
import { BaseViewModel } from '@/core/viewmodels'
import type { ${componentName}State } from './${componentName}.types'

const initialState: ${componentName}State = {
  loading: false,
  error: null,
}

@injectable()
export class ${componentName}ViewModel extends BaseViewModel<${componentName}State> {
  constructor() {
    super(initialState)
  }

  // Add business logic methods here
  async initialize(): Promise<void> {
    this.setState({ loading: true })
    try {
      // Business logic here
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false, error: String(error) })
    }
  }
}
`,

  // Types
  types: `export interface ${componentName}Props {
  // Add props here
}

export interface ${componentName}State {
  loading: boolean
  error: string | null
}
`,

  // Styles
  styles: `import styled from 'styled-components'
import { theme } from '@/theme'

export const Container = styled.div\`
  display: flex;
  flex-direction: column;
  padding: \${theme.spacing.md};
\`
`,

  // Index (barrel export)
  index: `export { ${componentName} } from './${componentName}.view'
export { ${componentName}ViewModel } from './${componentName}.viewmodel'
export type { ${componentName}Props, ${componentName}State } from './${componentName}.types'
`,
}

// Create component directory
fs.mkdirSync(componentDir, { recursive: true })

// Write files
const files = [
  { name: `${componentName}.view.tsx`, content: templates.view },
  { name: `${componentName}.viewmodel.ts`, content: templates.viewmodel },
  { name: `${componentName}.types.ts`, content: templates.types },
  { name: `${componentName}.styles.ts`, content: templates.styles },
  { name: 'index.ts', content: templates.index },
]

files.forEach(file => {
  const filePath = path.join(componentDir, file.name)
  fs.writeFileSync(filePath, file.content)
  console.log(`  ✅ Created ${file.name}`)
})

console.log(`
✨ Component ${componentName} created successfully!
📁 Location: src/${customPath}/${componentName}/

Files created:
  - ${componentName}.view.tsx      (UI Component)
  - ${componentName}.viewmodel.ts  (Business Logic)
  - ${componentName}.types.ts      (TypeScript types)
  - ${componentName}.styles.ts     (Styled components)
  - index.ts                       (Barrel export)

Usage:
  import { ${componentName} } from '@/${customPath}/${componentName}'
`)
