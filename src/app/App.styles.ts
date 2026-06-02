import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const AppRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
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
export const AppContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
`
