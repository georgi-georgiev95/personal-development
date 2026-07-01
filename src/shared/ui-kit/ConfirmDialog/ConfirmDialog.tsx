import React from 'react'
import { theme } from '@/shared/styles/theme'
import { Modal } from '../Modal'
import { Button } from '../Button'
import { DialogTitle, DialogMessage } from './ConfirmDialog.styles'

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
        <Button
          variant="primary"
          onClick={handleConfirm}
          style={
            destructive
              ? {
                  background: theme.colors.error,
                  color: theme.colors.textInverse,
                }
              : undefined
          }
        >
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
