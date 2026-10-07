import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AIDeliveryLabPage } from './AIDeliveryLabPage'

describe('stage artifact editor', () => {
  it('saves literal text, rejects blank input, cancels edits, and keeps notes during navigation', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/demo/tasks/new']}>
        <Routes>
          <Route path="/demo/*" element={<AIDeliveryLabPage />} />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Title'), 'Example task')
    await user.type(screen.getByLabelText('Goal'), 'Record a delivery outcome')
    await user.click(screen.getByRole('button', { name: 'Create task' }))

    await user.click(
      screen.getByRole('button', { name: 'Save discovery notes' })
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Enter some notes before saving.'
    )

    const literalText = '<script>alert("hello")</script>'
    const editor = screen.getByRole('textbox', { name: 'Discovery notes' })
    await user.type(editor, literalText)
    await user.click(
      screen.getByRole('button', { name: 'Save discovery notes' })
    )
    expect(screen.getByText(literalText)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.clear(screen.getByRole('textbox', { name: 'Discovery notes' }))
    await user.type(
      screen.getByRole('textbox', { name: 'Discovery notes' }),
      'Unsaved edit'
    )
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText(literalText)).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '← All tasks' }))
    await user.click(screen.getByRole('link', { name: 'Example task' }))
    expect(screen.getByText(literalText)).toBeInTheDocument()
  })
})

describe('validation results', () => {
  it('labels manual evidence, explains blockers, and marks results stale after work changes', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/demo/tasks/new']}>
        <Routes>
          <Route path="/demo/*" element={<AIDeliveryLabPage />} />
        </Routes>
      </MemoryRouter>
    )

    await user.type(screen.getByLabelText('Title'), 'Validation task')
    await user.type(screen.getByLabelText('Goal'), 'Record actual checks')
    await user.click(screen.getByRole('button', { name: 'Create task' }))
    await user.click(screen.getByRole('button', { name: 'Complete stage' }))
    await user.click(screen.getByRole('button', { name: 'Complete stage' }))
    await user.click(screen.getByRole('button', { name: 'Complete stage' }))

    expect(screen.getByText(/Typecheck has not been run/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Complete stage' })
    ).toBeDisabled()

    await user.selectOptions(
      screen.getByLabelText('Result for Typecheck'),
      'passed'
    )
    await user.click(
      screen.getByRole('button', { name: 'Save Typecheck result' })
    )
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Add an evidence note or URL before marking a check passed.'
    )

    await user.type(
      screen.getByLabelText(/Evidence note or URL for Typecheck/),
      'pnpm typecheck succeeded'
    )
    await user.click(
      screen.getByRole('button', { name: 'Save Typecheck result' })
    )
    expect(screen.getByText('Passed · manually reported')).toBeInTheDocument()
    expect(screen.getByText(/Lint has not been run/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Implementation/ }))
    await user.type(
      screen.getByRole('textbox', { name: 'Implementation notes' }),
      'Implementation changed after checks.'
    )
    await user.click(
      screen.getByRole('button', { name: 'Save implementation notes' })
    )
    await user.click(screen.getByRole('button', { name: /Validation/ }))

    expect(
      screen.getByText(/Stale: evidence is for work revision/)
    ).toBeInTheDocument()
    expect(screen.getByText(/current work revision is 2/)).toBeInTheDocument()
  })
})
