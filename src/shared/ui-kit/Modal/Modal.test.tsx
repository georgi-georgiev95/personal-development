import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Modal } from './Modal'

const ModalHeader = Modal.Header
const ModalContent = Modal.Content
const ModalFooter = Modal.Footer

describe('Modal', () => {
  it('is closed by default', () => {
    render(
      <Modal>
        <ModalHeader>Title</ModalHeader>
        <ModalContent>Body</ModalContent>
      </Modal>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens when onOpenChange is called with true', () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Modal open={false} onOpenChange={onOpenChange}>
        <ModalHeader>Title</ModalHeader>
      </Modal>
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(
      <Modal open onOpenChange={onOpenChange}>
        <ModalHeader>Title</ModalHeader>
      </Modal>
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders Header, Content, and Footer children', () => {
    render(
      <Modal open onOpenChange={vi.fn()}>
        <ModalHeader>My title</ModalHeader>
        <ModalContent>My content</ModalContent>
        <ModalFooter>My footer</ModalFooter>
      </Modal>
    )
    expect(screen.getByText('My title')).toBeInTheDocument()
    expect(screen.getByText('My content')).toBeInTheDocument()
    expect(screen.getByText('My footer')).toBeInTheDocument()
  })

  it('closes when the overlay is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={onOpenChange}>
        <ModalHeader>Title</ModalHeader>
      </Modal>
    )
    await user.click(screen.getByTestId('modal-overlay'))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('closes when the close callback is triggered from Header', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={onOpenChange}>
        <ModalHeader>Title</ModalHeader>
      </Modal>
    )
    await user.click(screen.getByRole('button', { name: /close modal/i }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('does not call onOpenChange when clicking inside the dialog', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={onOpenChange}>
        <ModalHeader>Title</ModalHeader>
        <ModalContent>Body text</ModalContent>
      </Modal>
    )
    await user.click(screen.getByText('Body text'))
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('renders nothing to the DOM when closed (portal cleanup)', () => {
    const { container } = render(
      <Modal open={false} onOpenChange={vi.fn()}>
        <ModalHeader>Title</ModalHeader>
      </Modal>
    )
    expect(container.querySelector('[data-modal]')).not.toBeInTheDocument()
  })

  it('applies aria attributes for accessibility', () => {
    render(
      <Modal open onOpenChange={vi.fn()} label="Settings">
        <ModalHeader>Title</ModalHeader>
      </Modal>
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-label', 'Settings')
  })

  it('forwards className to the dialog surface', () => {
    render(
      <Modal open onOpenChange={vi.fn()} className="custom-modal">
        <ModalHeader>Title</ModalHeader>
      </Modal>
    )
    expect(screen.getByRole('dialog')).toHaveClass('custom-modal')
  })

  it('hides the header close button when showCloseButton is false', () => {
    render(
      <Modal open onOpenChange={vi.fn()} showCloseButton={false}>
        <ModalHeader>Title</ModalHeader>
      </Modal>
    )
    expect(
      screen.queryByRole('button', { name: /close modal/i })
    ).not.toBeInTheDocument()
  })
})
