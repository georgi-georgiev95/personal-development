import { styled } from '@linaria/react'
import { theme } from '@/theme'

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${theme.colors.background};
`

export const NavBar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.navbar};
  box-shadow: ${theme.boxShadow.sm};
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 480px) {
    padding: ${theme.spacing.sm};
  }
`

export const AppTitle = styled.h1`
  margin: 0;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.primary};
  font-weight: 700;
  cursor: pointer;
`

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`

export const AuthStatus = styled.span`
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};

  @media (max-width: 480px) {
    display: none;
  }
`

export const NavButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  border-radius: ${theme.borderRadius};
  background: ${theme.colors.primary};
  color: #fff;
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.85;
  }
`

export const HeroSection = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${theme.spacing.xl};
  gap: ${theme.spacing.md};
`

export const HeroTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.xxl};
  color: ${theme.colors.text};

  @media (max-width: 768px) {
    font-size: ${theme.fontSizes.xl};
  }

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.lg};
  }
`

export const HeroSubtitle = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.textSecondary};
`
