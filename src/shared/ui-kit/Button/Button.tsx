import type { MouseEventHandler, ReactNode } from 'react'
import { PrimaryButton, SecondaryButton } from './Button.styles'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps {
  variant?: ButtonVariant
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
  className?: string
  id?: string
  title?: string
  name?: string
  value?: string | number | readonly string[]
  form?: string
  'aria-label'?: string
  'aria-pressed'?: boolean
}

export function Button({
  variant = 'primary',
  type,
  disabled,
  onClick,
  children,
  className,
  id,
  title,
  name,
  value,
  form,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
}: ButtonProps) {
  const Component = variant === 'secondary' ? SecondaryButton : PrimaryButton
  return (
    <Component
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      id={id}
      title={title}
      name={name}
      value={value}
      form={form}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      {children}
    </Component>
  )
}
