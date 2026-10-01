import type { MouseEventHandler, ReactNode } from 'react'
import { TextRoot } from './Text.styles'

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type TextTone =
  | 'default'
  | 'muted'
  | 'inverse'
  | 'accent'
  | 'success'
  | 'error'
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'
export type TextAlign = 'left' | 'center' | 'right'

type TextElement = 'p' | 'span' | 'strong' | 'em' | 'label' | 'small' | 'div'

interface TextProps {
  as?: TextElement
  size?: TextSize
  tone?: TextTone
  weight?: TextWeight
  align?: TextAlign
  truncate?: boolean
  children?: ReactNode
  id?: string
  className?: string
  title?: string
  role?: string
  onClick?: MouseEventHandler<HTMLElement>
  'aria-label'?: string
}

export function Text({
  as = 'p',
  size = 'md',
  tone = 'default',
  weight = 'regular',
  align = 'left',
  truncate = false,
  children,
  id,
  className,
  title,
  role,
  onClick,
  'aria-label': ariaLabel,
}: TextProps) {
  return (
    <TextRoot
      as={as}
      data-size={size}
      data-tone={tone}
      data-weight={weight}
      data-align={align}
      data-truncate={truncate}
      id={id}
      className={className}
      title={title}
      role={role}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </TextRoot>
  )
}
