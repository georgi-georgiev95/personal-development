import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from './Text'

const meta: Meta<typeof Text> = {
  title: 'UI-kit/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    children: 'Reusable ui-kit text component',
    size: 'md',
    tone: 'default',
    weight: 'regular',
    align: 'left',
    truncate: false,
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['p', 'span', 'strong', 'em', 'label', 'small', 'div'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    tone: {
      control: 'select',
      options: ['default', 'muted', 'inverse', 'accent', 'success', 'error'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold', 'bold'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Text>

export const Default: Story = {}

export const HeadingLike: Story = {
  args: {
    as: 'strong',
    size: 'lg',
    weight: 'bold',
    children: 'Large bold text for prominent UI labels',
  },
}

export const MutedHelper: Story = {
  args: {
    as: 'small',
    size: 'sm',
    tone: 'muted',
    children: 'Muted helper text for supplementary information.',
  },
}

export const Truncated: Story = {
  args: {
    as: 'span',
    truncate: true,
    children:
      'This is a very long line of text that should truncate instead of wrapping to the next line.',
  },
}
