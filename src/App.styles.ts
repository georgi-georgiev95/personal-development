import { styled } from '@linaria/react'
import { theme } from './theme'

export const AppRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${theme.colors.background};
`

export const AppFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md} 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  background: ${theme.colors.navbar};
  box-shadow: ${theme.boxShadow.sm};
`
