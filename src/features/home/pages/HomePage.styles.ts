import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const PageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const HeroOverlay = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

export const HeroContent = styled.div`
  text-align: center;
  padding: ${theme.spacing.lg};
`

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: ${theme.colors.heroText};
  letter-spacing: ${theme.letterSpacing.tight};
  margin: 0 0 ${theme.spacing.sm} 0;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);

  @media (max-width: ${theme.breakpoint.tablet}) {
    font-size: 2.5rem;
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: 1.75rem;
  }
`

export const HeroSubtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  color: ${theme.colors.starPrimary};
  margin: 0 0 ${theme.spacing.md} 0;
  letter-spacing: ${theme.letterSpacing.wide};

  @media (max-width: ${theme.breakpoint.tablet}) {
    font-size: 1.25rem;
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: 1rem;
  }
`

export const HeroTagline = styled.p`
  font-size: 1rem;
  font-weight: 300;
  color: ${theme.colors.heroTagline};
  max-width: 480px;
  margin: 0 auto;
  line-height: ${theme.lineHeight.relaxed};

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: 0.875rem;
  }
`
