import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

const sizeMap = {
  sm: '24px',
  md: '36px',
  lg: '48px',
}

export const AvatarRoot = styled.span<{ $size: 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => sizeMap[$size]};
  height: ${({ $size }) => sizeMap[$size]};
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.border};
  overflow: hidden;
  flex-shrink: 0;
`

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const AvatarInitials = styled.span`
  font-family: ${theme.font.family};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  color: ${theme.colors.textSecondary};
`
