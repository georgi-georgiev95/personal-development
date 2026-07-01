import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  background: ${theme.colors.cardBg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};

  @media (min-width: ${theme.breakpoint.tablet}) {
    flex-direction: row;
    align-items: flex-start;
  }
`

export const FileInput = styled.input`
  color: ${theme.colors.textSecondary};
  font-family: ${theme.font.family};
  font-size: ${theme.fontSizes.sm};

  @media (min-width: ${theme.breakpoint.tablet}) {
    flex: 0 0 auto;
    align-self: center;
  }
`

export const CaptionField = styled.div`
  flex: 1;
`

export const ErrorText = styled.p`
  margin: 0;
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.xs};
`

export const SignInPrompt = styled.p`
  margin: 0;
  padding: ${theme.spacing.md};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  border: 1px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
`
