import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const AppRoot = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100svh;
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

export const SkipLink = styled.a`
  position: absolute;
  top: -100px;
  left: ${theme.spacing.md};
  z-index: ${theme.zIndex.nav};
  padding: 10px 16px;
  background: ${theme.colors.background};
  color: ${theme.colors.heroText};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  font-size: ${theme.fontSizes.sm};
  text-decoration: none;

  &:focus-visible {
    top: ${theme.spacing.md};
  }
`

export const AppContent = styled.main`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  z-index: 1;
`
