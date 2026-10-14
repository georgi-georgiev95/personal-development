import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const ProductPage = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  align-items: center;
  gap: clamp(2rem, 6vw, 5.5rem);
  width: min(100%, 1200px);
  margin: auto;
  padding: clamp(3rem, 8vh, 6rem) clamp(2rem, 5vw, 4.5rem);

  @media (max-width: 1023px) {
    grid-template-columns: minmax(0, 1fr) minmax(300px, 0.9fr);
    gap: 2rem;
    padding: 4rem 2rem;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2.5rem 1.25rem 6rem;
  }
`

export const Eyebrow = styled.p`
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
`

export const Heading = styled.h1`
  max-width: 620px;
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(2.75rem, 5.2vw, 5rem);
  line-height: 1.04;
  letter-spacing: ${theme.letterSpacing.tight};

  @media (max-width: 1023px) {
    font-size: clamp(2.5rem, 5vw, 4rem);
  }

  @media (max-width: 767px) {
    font-size: clamp(2.7rem, 12vw, 3.6rem);
  }
`

export const Intro = styled.p`
  max-width: 540px;
  margin: ${theme.spacing.lg} 0 0;
  color: ${theme.colors.textSecondary};
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  line-height: ${theme.lineHeight.relaxed};
`

export const ActionLink = styled(Link)<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 ${theme.spacing.lg};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  color: ${({ $primary }) =>
    $primary ? theme.colors.textOnAccent : theme.colors.text};
  background: ${({ $primary }) =>
    $primary ? theme.colors.primary : 'transparent'};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition:
    color ${theme.transition.fast},
    background ${theme.transition.fast};

  &:hover {
    color: ${theme.colors.textOnAccent};
    background: ${theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }

  @media (max-width: 767px) {
    width: 100%;
    min-height: 52px;
  }
`

export const Section = styled.section`
  grid-column: 1 / -1;
  margin-top: 0;
  padding-top: ${theme.spacing.md};
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

  @media (max-width: 767px) {
    flex-direction: column;
  }
`

export const Example = styled.section`
  padding: clamp(1.5rem, 3vw, 2.5rem);
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.xl};
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  box-shadow: ${theme.boxShadow.sm};
  line-height: ${theme.lineHeight.relaxed};

  h2 {
    max-width: 380px;
    margin: 0 0 ${theme.spacing.lg};
    font-size: clamp(1.35rem, 2vw, 1.75rem);
    font-weight: 500;
    line-height: 1.25;
  }

  ol {
    display: grid;
    gap: ${theme.spacing.md};
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: plan-step;
  }

  li {
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.md};
    counter-increment: plan-step;
  }

  li::before {
    content: counter(plan-step);
    display: grid;
    place-items: center;
    flex: 0 0 28px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${theme.colors.starGlow};
    color: ${theme.colors.primary};
    font-size: ${theme.fontSizes.sm};
    font-weight: 600;
  }

  @media (max-width: 767px) {
    padding: 1.5rem;
  }
`
