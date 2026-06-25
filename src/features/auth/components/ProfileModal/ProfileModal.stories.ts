import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProfileModal } from '.'

const meta: Meta<typeof ProfileModal> = {
  title: 'Auth/ProfileModal',
  component: ProfileModal,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ProfileModal>

export const Default: Story = {}
