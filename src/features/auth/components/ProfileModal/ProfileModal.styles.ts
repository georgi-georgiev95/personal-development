import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const ProfileField = styled.div`
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: ${theme.colors.textInverse};
`

export const Label = styled.label`
  display: block;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs};
`

export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.cardBg};
  color: ${theme.colors.text};
  font-family: inherit;
  font-size: ${theme.fontSizes.sm};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`

export const TriggerButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.md};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.colors.primary};
  }
`
