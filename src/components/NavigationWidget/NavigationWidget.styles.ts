import { styled } from '@linaria/react'
import { theme } from '@/theme'

export const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  height: 56px;
  background: ${theme.colors.navbar};
  box-shadow: ${theme.boxShadow.sm};
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 0 ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: 0 ${theme.spacing.sm};
  }
`

export const AppTitle = styled.span`
  font-size: ${theme.fontSizes.md};
  font-weight: 700;
  color: ${theme.colors.primary};
  text-decoration: none;
  letter-spacing: 0.02em;
`

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`

export const AuthStatus = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};

  @media (max-width: 480px) {
    display: none;
  }
`

export const NavButton = styled.button`
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background: ${theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: ${theme.borderRadius};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`

export const CataloguePanel = styled.div`
  position: absolute;
  top: 56px;
  right: ${theme.spacing.lg};
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.boxShadow.md};
  min-width: 240px;
  z-index: 200;
  overflow: hidden;

  @media (max-width: 480px) {
    right: 0;
    left: 0;
    border-radius: 0;
  }
`

export const CatalogueItem = styled.button`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.md};
  background: transparent;
  border: none;
  border-bottom: 1px solid ${theme.colors.border};
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${theme.colors.background};
  }
`

export const CatalogueItemLabel = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.text};
  font-weight: 600;
`

export const CatalogueItemDesc = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.textSecondary};
`
