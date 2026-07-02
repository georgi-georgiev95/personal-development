import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'UI-kit/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    name: 'Alice Doe',
  },
}

export default meta

type Story = StoryObj<typeof Avatar>

export const Initials: Story = {
  args: {
    size: 'md',
  },
}

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=5',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}
