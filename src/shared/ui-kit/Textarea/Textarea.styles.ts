import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const TextareaField = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${theme.spacing.sm};
  font-family: ${theme.font.family};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textInverse};
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  resize: vertical;
  transition: border-color ${theme.transition.fast};

  &::placeholder {
    color: ${theme.colors.muted};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
