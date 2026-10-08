import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const WorkspacePage = styled.section`
  width: min(100%, 920px);
  margin: auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: ${theme.spacing.xl} ${theme.spacing.md};
  }
`

export const Eyebrow = styled.p`
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const Heading = styled.h1`
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(2.25rem, 7vw, 4rem);
  line-height: ${theme.lineHeight.tight};
  letter-spacing: ${theme.letterSpacing.tight};
`

export const Message = styled.p`
  max-width: 640px;
  margin: ${theme.spacing.lg} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.lg};
  line-height: ${theme.lineHeight.relaxed};
`

export const WorkspaceLink = styled(Link)`
  display: inline-block;
  margin: ${theme.spacing.xl} ${theme.spacing.md} 0 0;
  color: ${theme.colors.primary};
  font-weight: 600;

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }
`
