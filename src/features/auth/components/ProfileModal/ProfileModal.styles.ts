import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const HeaderBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  width: 100%;
  padding-right: ${theme.spacing.lg};
`

export const AvatarBadge = styled.div`
  width: 46px;
  height: 46px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(150deg, #2dd4bf, #0f766e);
  color: ${theme.colors.textOnAccent};
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.06em;
  flex-shrink: 0;
`

export const HeaderCopy = styled.div`
  min-width: 0;
`

export const ProfileField = styled.div`
  font-size: ${theme.fontSizes.md};
  font-weight: 700;
  letter-spacing: ${theme.letterSpacing.tight};
  color: ${theme.colors.textInverse};
`

export const ProfileSubtext = styled.p`
  margin: ${theme.spacing.xs} 0 0;
  color: ${theme.colors.heroTagline};
  font-size: ${theme.fontSizes.xs};
`

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: 22px;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.015);
`

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: ${theme.breakpoint.mobile}) {
    grid-template-columns: 1fr;
  }
`

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`

export const Label = styled.label`
  display: block;
  font-size: 10px;
  color: ${theme.colors.primary};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 8px;
`

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  box-sizing: border-box;
  transition:
    border-color ${theme.transition.fast},
    box-shadow ${theme.transition.fast};

  &:hover {
    border-color: rgba(45, 212, 191, 0.3);
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.15);
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }

  &::placeholder {
    color: ${theme.colors.muted};
  }
`

export const HelperText = styled.p`
  margin: 0;
  color: ${theme.colors.heroTagline};
  font-size: ${theme.fontSizes.xs};
`

export const StatusText = styled.p<{ $variant?: 'info' | 'error' }>`
  margin: 0;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'error'
        ? 'rgba(244, 67, 54, 0.35)'
        : 'rgba(45, 212, 191, 0.15)'};
  background: ${({ $variant }) =>
    $variant === 'error' ? 'rgba(244, 67, 54, 0.14)' : 'rgba(0, 0, 0, 0.35)'};
  color: ${({ $variant }) =>
    $variant === 'error' ? '#fecaca' : theme.colors.starSecondary};
  font-size: ${theme.fontSizes.sm};
`

export const FooterHint = styled.span<{ $dirty?: boolean }>`
  margin-right: auto;
  font-size: ${theme.fontSizes.sm};
  color: ${({ $dirty }) =>
    $dirty ? theme.colors.starSecondary : 'rgba(255, 255, 255, 0.4)'};
  align-self: center;
`

export const TriggerButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  transition: opacity ${theme.transition.fast};

  &:hover {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.2);
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    min-height: 44px;
    padding: 9px 0;
  }
`

export const TriggerAvatar = styled.span`
  width: 26px;
  height: 26px;
  border-radius: ${theme.borderRadius.full};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(150deg, #2dd4bf, #0f766e);
  color: ${theme.colors.textOnAccent};
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
`

export const TriggerName = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #fff;
`
