import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI-kit/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    placeholder: 'Write a comment...',
  },
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Cannot edit this',
  },
}
