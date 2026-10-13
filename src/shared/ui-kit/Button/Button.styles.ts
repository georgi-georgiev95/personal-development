import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

const base = `
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  font-family: ${theme.font.family};
  font-weight: 600;
  border: 1px solid transparent;
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition:
    background ${theme.transition.fast},
    border-color ${theme.transition.fast},
    color ${theme.transition.fast};
  text-decoration: none;

  &:hover {
    filter: brightness(1.04);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: none;
  }

`

export const PrimaryButton = styled.button`
  ${base}
  background: ${theme.colors.gradient};
  color: ${theme.colors.textOnAccent};
  font-size: ${theme.fontSizes.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
`

export const SecondaryButton = styled.button`
  ${base}
  background: transparent;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.primary};

  &:hover {
    background: ${theme.colors.cardBg};
  }
`
