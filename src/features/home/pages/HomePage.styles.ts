import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const ProductPage = styled.section`
  width: min(100%, 1040px);
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
  font-size: clamp(2.25rem, 6vw, 4.5rem);
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
  margin: 0;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
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

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }
`

export const Section = styled.section`
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  line-height: ${theme.lineHeight.relaxed};
`

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
`

export const Example = styled.section`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  line-height: ${theme.lineHeight.relaxed};

  h2 {
    margin: 0;
    font-size: ${theme.fontSizes.xl};
    font-weight: 500;
  }

  ol {
    display: grid;
    gap: ${theme.spacing.sm};
    margin: 0;
    padding: 0;
    counter-reset: plan-step;
  }

  li {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    font-weight: 500;
    counter-increment: plan-step;
  }

  li::before {
    content: counter(plan-step);
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${theme.colors.starGlow};
    color: ${theme.colors.primary};
    font-size: ${theme.fontSizes.sm};
  }

  p:last-child {
    margin: ${theme.spacing.md} 0 0;
    padding-top: ${theme.spacing.sm};
    border-top: 1px solid ${theme.colors.border};
    font-size: ${theme.fontSizes.sm};
    color: ${theme.colors.textSecondary};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    grid-template-columns: 1fr;
    padding: ${theme.spacing.md};
  }
`

export const ExampleInput = styled.div`
  padding-right: ${theme.spacing.lg};
  border-right: 1px solid ${theme.colors.border};

  @media (max-width: ${theme.breakpoint.mobile}) {
    border-right: 0;
    padding-right: 0;
  }
`
