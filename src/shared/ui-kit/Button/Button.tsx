import React from 'react'
import { PrimaryButton, SecondaryButton } from './Button.styles'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  ...rest
}) => {
  if (variant === 'secondary') {
    return <SecondaryButton {...rest}>{children}</SecondaryButton>
  }
  return <PrimaryButton {...rest}>{children}</PrimaryButton>
}
