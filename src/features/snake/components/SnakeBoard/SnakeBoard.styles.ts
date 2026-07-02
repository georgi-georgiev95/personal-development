import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const BoardCanvas = styled.canvas`
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
`
