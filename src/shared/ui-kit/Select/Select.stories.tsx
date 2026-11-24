import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './Select'

const meta = {
  title: 'UI-kit/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Priority',
    defaultValue: 'optional',
    children: (
      <>
        <option value="optional">Optional</option>
        <option value="must-do">Must do</option>
      </>
    ),
  },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = { args: { disabled: true } }
