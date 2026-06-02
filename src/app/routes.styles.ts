import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const RouteFallbackContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: ${theme.colors.surface};
`

export const RouteFallbackText = styled.p`
  color: ${theme.colors.textInverse};
  font-family: ${theme.font.family};
  font-size: ${theme.fontSizes.sm};
`
