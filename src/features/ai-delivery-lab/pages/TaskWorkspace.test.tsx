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
