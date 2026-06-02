import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  min-height: 200px;
  text-align: center;
  font-family: ${theme.font.family};
`

export const ErrorTitle = styled.h2`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.xl};
  margin-bottom: ${theme.spacing.md};
`

export const ErrorMessageText = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.md};
  margin-bottom: ${theme.spacing.lg};
  max-width: 400px;
`

export const RetryButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary};
  color: ${theme.colors.cardBg};
  font-size: ${theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: opacity ${theme.transition.fast};

  &:hover {
    opacity: 0.9;
  }
`
