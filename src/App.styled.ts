import styled from 'styled-components'
import { theme } from './theme'

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

export const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`

export const AppFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 5vh;
  text-align: center;
  padding: ${theme.spacing.md} 0;
  color: ${theme.colors.text};
  font-weight: 500;
  font-size: ${theme.fontSizes.sm};
  background: ${theme.colors.background};
  box-shadow: ${theme.boxShadow.sm};
`
