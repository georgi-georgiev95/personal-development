import type { MouseEventHandler, ReactNode } from 'react'
import { IconButtonRoot } from './IconButton.styles'

export type IconButtonVariant = 'default' | 'danger'

interface IconButtonProps {
  variant?: IconButtonVariant
  active?: boolean
  'aria-label': string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
  className?: string
  id?: string
  title?: string
}

export function IconButton({
  variant = 'default',
  active = false,
  type = 'button',
  disabled,
  onClick,
  children,
  className,
  id,
  title,
  'aria-label': ariaLabel,
}: IconButtonProps) {
  return (
    <IconButtonRoot
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      id={id}
      title={title}
      aria-label={ariaLabel}
      $variant={variant}
      $active={active}
    >
      {children}
    </IconButtonRoot>
  )
}
