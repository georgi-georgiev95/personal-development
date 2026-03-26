import type { Meta, StoryObj } from '@storybook/react-vite'
import { Watchlist } from './Watchlist.view'

const meta: Meta<typeof Watchlist> = {
  title: 'Widgets/Watchlist',
  component: Watchlist,
  parameters: { layout: 'centered' },
}

export default meta

type Story = StoryObj<typeof Watchlist>

export const Default: Story = {}
