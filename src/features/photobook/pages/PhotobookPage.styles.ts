import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const PageWrapper = styled.div`
  width: 100%;
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
    gap: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: ${theme.spacing.sm};
    padding-top: calc(${theme.layout.navHeightMobile} + ${theme.spacing.sm});
  }
`

export const PageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${theme.spacing.md};
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

export const CmsLink = styled(Link)`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition:
    background ${theme.transition.fast},
    transform ${theme.transition.fast};

  &:hover {
    background: ${theme.colors.primary}1a;
    transform: translateY(-1px);
  }
`

export const PageSubtitle = styled.p`
  margin: ${theme.spacing.sm} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
`
