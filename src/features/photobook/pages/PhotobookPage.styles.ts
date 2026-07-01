import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

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
    gap: ${theme.spacing.md};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: ${theme.spacing.sm};
    padding-top: calc(${theme.layout.navHeightMobile} + ${theme.spacing.sm});
  }
`

export const PageTitle = styled.h1`
  margin: 0;
  font-size: ${theme.fontSizes.xxl};
  color: ${theme.colors.textInverse};
`

export const PageSubtitle = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
`
