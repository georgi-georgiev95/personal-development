import type { CSSProperties } from 'react'
import { theme } from '@/shared/styles/theme'
import { SkeletonBase } from './Skeleton.styles'

export type SkeletonVariant = 'text' | 'circle' | 'rect'

interface SkeletonProps {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
  role?: string
  className?: string
  id?: string
  title?: string
  style?: CSSProperties
  'aria-label'?: string
  'data-testid'?: string
}

const toCssSize = (value: string | number | undefined): string | undefined =>
  typeof value === 'number' ? `${value}px` : value

export function Skeleton({
  variant = 'text',
  width,
  height,
  role,
  className,
  id,
  title,
  style,
  'aria-label': ariaLabel,
  'data-testid': testId,
}: SkeletonProps) {
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
      role={role ?? 'status'}
      aria-label={ariaLabel ?? 'Loading'}
      data-testid={testId}
      className={className}
      id={id}
      title={title}
      style={style}
      $width={toCssSize(width) ?? defaultWidth}
      $height={toCssSize(height) ?? defaultHeight}
      $radius={radius}
    />
  )
}
