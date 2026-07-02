import React from 'react'
import { IconButtonRoot } from './IconButton.styles'

export type IconButtonVariant = 'default' | 'danger'

interface IconButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label'
> {
  variant?: IconButtonVariant
  active?: boolean
  'aria-label': string
}

export const IconButton: React.FC<IconButtonProps> = ({
  variant = 'default',
  active = false,
  type = 'button',
  children,
  ...rest
}) => (
  <IconButtonRoot $variant={variant} $active={active} type={type} {...rest}>
    {children}
  </IconButtonRoot>
)
