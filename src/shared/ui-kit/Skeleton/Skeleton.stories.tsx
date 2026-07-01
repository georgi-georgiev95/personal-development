import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = {
  title: 'UI-kit/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    variant: 'text',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circle', 'rect'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Skeleton>

export const Text: Story = {
  args: {
    variant: 'text',
    width: '160px',
  },
}

export const Circle: Story = {
  args: {
    variant: 'circle',
    width: '40px',
    height: '40px',
  },
}

export const Rect: Story = {
  args: {
    variant: 'rect',
    width: '220px',
    height: '80px',
  },
}
