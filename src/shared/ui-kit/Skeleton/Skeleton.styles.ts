import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const shimmer = `
  @keyframes ui-kit-skeleton-shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`

export const SkeletonBase = styled.span<{
  $width: string
  $height: string
  $radius: string
}>`
  ${shimmer}
  display: inline-block;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border-radius: ${({ $radius }) => $radius};
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.06) 25%,
    rgba(255, 255, 255, 0.14) 37%,
    rgba(255, 255, 255, 0.06) 63%
  );
  background-size: 400% 100%;
  animation: ui-kit-skeleton-shimmer 1.4s ease-in-out infinite;
  transition: opacity ${theme.transition.fast};
`
