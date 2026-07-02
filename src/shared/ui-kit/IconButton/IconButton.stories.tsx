import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { IconButton } from './IconButton'

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
  </svg>
)

const meta: Meta<typeof IconButton> = {
  title: 'UI-kit/IconButton',
  component: IconButton,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof IconButton>

export const ReactionToggle: Story = {
  render: () => {
    const [active, setActive] = useState(false)
    return (
      <IconButton
        aria-label="Like comment"
        active={active}
        onClick={() => setActive((prev) => !prev)}
      >
        <HeartIcon />
      </IconButton>
    )
  },
}

export const Danger: Story = {
  args: {
    variant: 'danger',
    'aria-label': 'Delete',
    children: <TrashIcon />,
  },
}
