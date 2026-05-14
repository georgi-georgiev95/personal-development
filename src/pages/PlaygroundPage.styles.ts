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

export const CanvasMount = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
`

export const ScrollSection = styled.section`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${theme.spacing.lg};
  }
`

export const SectionContent = styled.div`
  max-width: 480px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(108, 99, 255, 0.35);
  border-radius: 20px;
  padding: ${theme.spacing.xl};
  box-shadow:
    0 12px 48px rgba(31, 38, 135, 0.22),
    0 2px 8px rgba(108, 99, 255, 0.1);
  text-align: center;

  @media (max-width: 480px) {
    padding: ${theme.spacing.lg};
  }
`

export const SectionLabel = styled.span`
  display: inline-block;
  font-size: ${theme.fontSizes.xs};
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`

export const SectionTitle = styled.h2`
  margin: 0 0 ${theme.spacing.md};
  font-size: ${theme.fontSizes.xxl};
  color: #1a1a2e;
  font-weight: 800;
  line-height: 1.15;

  @media (max-width: 768px) {
    font-size: ${theme.fontSizes.xl};
  }

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.lg};
  }
`

export const SectionText = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.md};
  color: #3a3a5c;
  line-height: 1.7;
`

export const ScrollHint = styled.div`
  position: absolute;
  bottom: ${theme.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: opacity 0.5s ease;
  pointer-events: none;
  user-select: none;

  svg {
    animation: bounce 1.4s ease-in-out infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(6px);
    }
  }
`
