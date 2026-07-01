import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const DialogTitle = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.textInverse};
`

export const DialogMessage = styled.p`
  margin: 0;
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.textSecondary};
  line-height: ${theme.lineHeight.relaxed};
`

export const DestructiveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.font.family};
  font-weight: 600;
  font-size: ${theme.fontSizes.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.error};
  color: ${theme.colors.textInverse};
  cursor: pointer;
  transition:
    filter ${theme.transition.fast},
    transform ${theme.transition.fast};

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`
