import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

const base = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.font.family};
  font-weight: 600;
  border: none;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition:
    background ${theme.transition.fast},
    transform ${theme.transition.fast};
  text-decoration: none;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

export const PrimaryButton = styled.button`
  ${base}
  background: ${theme.colors.gradient};
  color: ${theme.colors.heroText};
  font-size: ${theme.fontSizes.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
`

export const SecondaryButton = styled.button`
  ${base}
  background: transparent;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: 1px solid ${theme.colors.primary};

  &:hover {
    background: rgba(249, 115, 22, 0.1);
  }
`
