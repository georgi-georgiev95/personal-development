import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const BackLink = styled(Link)`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  text-decoration: none;
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.colors.textInverse};
  }
`

export const PageWrapper = styled.div`
  max-width: ${theme.layout.containerMaxWidth};
  margin: 0 auto;
  padding: ${theme.spacing.lg};
  padding-top: calc(${theme.layout.navHeight} + ${theme.spacing.lg});
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoint.tablet}) {
    padding: ${theme.spacing.md};
    padding-top: calc(${theme.layout.navHeightTablet} + ${theme.spacing.md});
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: ${theme.spacing.sm};
    padding-top: calc(${theme.layout.navHeightMobile} + ${theme.spacing.sm});
  }
`

export const PageEyebrow = styled.p`
  margin: 0 0 ${theme.spacing.sm};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 400;
`

export const PageTitle = styled.h1`
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.01em;
  font-size: 28px;
  color: ${theme.colors.textInverse};
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.boxShadow.card};
`

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.textInverse};
`
