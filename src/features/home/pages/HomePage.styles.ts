import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const ProductPage = styled.section`
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
  max-width: 760px;
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(2.5rem, 8vw, 5rem);
  line-height: ${theme.lineHeight.tight};
  letter-spacing: ${theme.letterSpacing.tight};
`

export const Intro = styled.p`
  max-width: 640px;
  margin: ${theme.spacing.lg} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.lg};
  line-height: ${theme.lineHeight.relaxed};
`

export const ActionLink = styled(Link)<{ $primary?: boolean }>`
  display: inline-block;
  margin-top: ${theme.spacing.xl};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.sm};
  color: ${({ $primary }) =>
    $primary ? theme.colors.textOnAccent : theme.colors.text};
  background: ${({ $primary }) =>
    $primary ? theme.colors.primary : 'transparent'};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    color: ${theme.colors.textOnAccent};
    background: ${theme.colors.primary};
  }
`
