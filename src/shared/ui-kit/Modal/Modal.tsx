import React, { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Overlay,
  Dialog,
  Header,
  CloseButton,
  Content,
  Footer,
} from './Modal.styles'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface ModalBaseProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  label?: string
  className?: string
  showCloseButton?: boolean
  children?: React.ReactNode
}

interface ModalComposition {
  Header: React.FC<React.HTMLAttributes<HTMLDivElement>>
  Content: React.FC<React.HTMLAttributes<HTMLDivElement>>
  Footer: React.FC<React.HTMLAttributes<HTMLDivElement>>
}

type ModalComponent = React.FC<ModalBaseProps> & ModalComposition

const Modal: ModalComponent = ({
  open,
  onOpenChange,
  label,
  className,
  showCloseButton = true,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null)

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onOpenChange?.(false)
    },
    [onOpenChange]
  )

  // Escape closes; focus moves into the dialog on open and returns to the
  // trigger on close (WCAG 2.1 dialog pattern).
  useEffect(() => {
    if (!open) return
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    dialogRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange?.(false)
        return
      }
      if (event.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, onOpenChange])

  if (!open) return null

  return createPortal(
    <Overlay
      data-testid="modal-overlay"
      data-modal
      onClick={handleOverlayClick}
      role="presentation"
    >
      <Dialog
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={className}
      >
        {showCloseButton && (
          <CloseButton
            type="button"
            aria-label="Close modal"
            onClick={() => onOpenChange?.(false)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseButton>
        )}
        {children}
      </Dialog>
    </Overlay>,
    document.body
  )
}

const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => <Header {...rest}>{children}</Header>

const ModalContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => <Content {...rest}>{children}</Content>

const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => <Footer {...rest}>{children}</Footer>

Modal.Header = ModalHeader
Modal.Content = ModalContent
Modal.Footer = ModalFooter

export { Modal }
