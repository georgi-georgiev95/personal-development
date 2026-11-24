import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Select } from './Select'

describe('Select', () => {
  it('passes changes to the caller and submits the selected option in a form', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <form aria-label="Task">
        <label htmlFor="priority">Priority</label>
        <Select
          id="priority"
          name="priority"
          defaultValue="optional"
          onChange={onChange}
        >
          <option value="optional">Optional</option>
          <option value="must-do">Must do</option>
        </Select>
      </form>
    )

    const select = screen.getByRole('combobox', { name: 'Priority' })
    expect(select).toHaveValue('optional')
    await user.selectOptions(select, 'must-do')
    expect(onChange).toHaveBeenCalledOnce()
    expect(screen.getByRole('form', { name: 'Task' })).toHaveFormValues({
      priority: 'must-do',
    })
  })

  it('can be disabled', () => {
    render(<Select aria-label="Priority" disabled />)
    expect(screen.getByRole('combobox', { name: 'Priority' })).toBeDisabled()
  })
})
