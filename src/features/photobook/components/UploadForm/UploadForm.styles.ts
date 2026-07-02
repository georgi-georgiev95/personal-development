import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.surface};
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.boxShadow.card};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 2px;
    background: ${theme.colors.gradient};
    opacity: 0.7;
  }

  @media (min-width: ${theme.breakpoint.tablet}) {
    flex-direction: row;
    align-items: flex-start;
  }
`

export const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`

export const FilePicker = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;

  @media (min-width: ${theme.breakpoint.tablet}) {
    flex: 0 0 auto;
    align-self: center;
  }
`

export const FileLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    background ${theme.transition.fast},
    transform ${theme.transition.fast};

  &:hover {
    background: ${theme.colors.primary}1a;
    transform: translateY(-1px);
  }
`

export const FileName = styled.span`
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.xs};
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
