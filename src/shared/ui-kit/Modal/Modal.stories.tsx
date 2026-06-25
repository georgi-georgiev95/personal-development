import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../Button'

const meta: Meta<typeof Modal> = {
  title: 'UI-kit/Modal',
  component: Modal,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Modal>

const ControlledModal = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onOpenChange={setOpen} label="Example modal">
        <Modal.Header>
          <h2 style={{ margin: 0 }}>Example modal</h2>
        </Modal.Header>
        <Modal.Content>
          <p style={{ margin: 0 }}>
            This is a generic reusable modal. Compose it with Header, Content,
            and Footer.
          </p>
        </Modal.Content>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: () => <ControlledModal />,
}

export const WithoutCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          onOpenChange={setOpen}
          label="No close button"
          showCloseButton={false}
        >
          <Modal.Header>
            <h2 style={{ margin: 0 }}>No close button</h2>
          </Modal.Header>
          <Modal.Content>
            <p style={{ margin: 0 }}>
              This modal has the header close button hidden.
            </p>
          </Modal.Content>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Got it
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  },
}
