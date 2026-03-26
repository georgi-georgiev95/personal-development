import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProfileWidget } from './ProfileWidget.view'

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof ProfileWidget> = {
  title: 'Widgets/ProfileWidget',
  component: ProfileWidget,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof ProfileWidget>

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    uid: 'story-user',
  },
}

export const NoUid: Story = {
  args: {},
  name: 'No UID (unauthenticated)',
}
