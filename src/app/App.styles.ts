import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const AppRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow-x: hidden;
  overflow-y: hidden;
  background: ${theme.colors.background};
  position: relative;
`

export const CanvasBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`

export const AppFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md} 0;
  color: rgba(255, 255, 255, 0.5);
  font-size: ${theme.fontSizes.sm};
  background: transparent;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: relative;
  z-index: 1;
`

export const AppContent = styled.main`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  z-index: 1;
`
