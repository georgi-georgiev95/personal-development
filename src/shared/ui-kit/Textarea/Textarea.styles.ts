import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const TextareaField = styled.textarea`
  width: 100%;
  min-height: 96px;
  padding: ${theme.spacing.md};
  font-family: ${theme.font.family};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textInverse};
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  resize: none;
  overflow-y: auto;
  line-height: ${theme.lineHeight.relaxed};
  transition:
    border-color ${theme.transition.fast},
    box-shadow ${theme.transition.fast};

  &::placeholder {
    color: ${theme.colors.muted};
  }

  &:focus-visible {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.starGlow};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
