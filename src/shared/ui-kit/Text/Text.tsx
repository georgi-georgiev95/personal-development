import React from 'react'
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

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextElement
  size?: TextSize
  tone?: TextTone
  weight?: TextWeight
  align?: TextAlign
  truncate?: boolean
  children?: React.ReactNode
}

export const Text: React.FC<TextProps> = ({
  as = 'p',
  size = 'md',
  tone = 'default',
  weight = 'regular',
  align = 'left',
  truncate = false,
  children,
  ...rest
}) => {
  return (
    <TextRoot
      as={as}
      data-size={size}
      data-tone={tone}
      data-weight={weight}
      data-align={align}
      data-truncate={truncate}
      {...rest}
    >
      {children}
    </TextRoot>
  )
}
