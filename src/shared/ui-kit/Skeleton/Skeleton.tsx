import React from 'react'
import { theme } from '@/shared/styles/theme'
import { SkeletonBase } from './Skeleton.styles'

export type SkeletonVariant = 'text' | 'circle' | 'rect'

interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
}

const toCssSize = (value: string | number | undefined): string | undefined =>
  typeof value === 'number' ? `${value}px` : value

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  ...rest
}) => {
  const defaultHeight = variant === 'text' ? '1em' : '40px'
  const defaultWidth = variant === 'circle' ? defaultHeight : '100%'
  const radius =
    variant === 'circle'
      ? theme.borderRadius.full
      : variant === 'rect'
        ? theme.borderRadius.md
        : theme.borderRadius.sm

  return (
    <SkeletonBase
      role="status"
      aria-label="Loading"
      $width={toCssSize(width) ?? defaultWidth}
      $height={toCssSize(height) ?? defaultHeight}
      $radius={radius}
      {...rest}
    />
  )
}
