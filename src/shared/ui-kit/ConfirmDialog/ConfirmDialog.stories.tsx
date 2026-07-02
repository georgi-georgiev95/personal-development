import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ConfirmDialog } from './ConfirmDialog'
import { Button } from '../Button'

const meta: Meta<typeof ConfirmDialog> = {
  title: 'UI-kit/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ConfirmDialog>

const ControlledConfirmDialog = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Delete photo
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this photo?"
        message="This will permanently remove the photo and its comments."
        confirmLabel="Delete"
        destructive
        onConfirm={() => console.log('confirmed')}
      />
    </>
  )
}

export const Default: Story = {
  render: () => <ControlledConfirmDialog />,
}
