import React from 'react'
import { AvatarImage, AvatarInitials, AvatarRoot } from './Avatar.styles'

export type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  src?: string
  name: string
  size?: AvatarSize
  className?: string
}

const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className,
}) => (
  <AvatarRoot $size={size} className={className}>
    {src ? (
      <AvatarImage src={src} alt={name} />
    ) : (
      <AvatarInitials>{getInitials(name)}</AvatarInitials>
    )}
  </AvatarRoot>
)
