import React from 'react'
import { Modal } from '../Modal'
import { Button } from '../Button'
import {
  DialogTitle,
  DialogMessage,
  DestructiveButton,
} from './ConfirmDialog.styles'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  destructive?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  destructive = false,
}) => {
  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} label={title}>
      <Modal.Header>
        <DialogTitle>{title}</DialogTitle>
      </Modal.Header>
      <Modal.Content>
        <DialogMessage>{message}</DialogMessage>
      </Modal.Content>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        {destructive ? (
          <DestructiveButton type="button" onClick={handleConfirm}>
            {confirmLabel}
          </DestructiveButton>
        ) : (
          <Button variant="primary" onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}
