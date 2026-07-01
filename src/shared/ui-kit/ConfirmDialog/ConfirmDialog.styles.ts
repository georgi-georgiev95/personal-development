import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const DialogTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.textInverse};
`

export const DialogMessage = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  line-height: ${theme.lineHeight.relaxed};
`
