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
  width: 42px;
  height: 42px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.22),
      rgba(255, 255, 255, 0)
    ),
    ${theme.colors.gradient};
  color: ${theme.colors.heroText};
  font-size: ${theme.fontSizes.sm};
  font-weight: 700;
  letter-spacing: 0.06em;
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.32);
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
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.02) 45%,
    rgba(255, 255, 255, 0.07) 100%
  );
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    inset 0 -1px 0 rgba(0, 0, 0, 0.28);
`

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.sm};

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
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.starSecondary};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid rgba(249, 115, 22, 0.2);
  background: rgba(0, 0, 0, 0.45);
  color: ${theme.colors.textInverse};
  font-family: inherit;
  font-size: ${theme.fontSizes.sm};
  box-sizing: border-box;
  transition:
    border-color ${theme.transition.fast},
    box-shadow ${theme.transition.fast};

  &:hover {
    border-color: rgba(249, 115, 22, 0.35);
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.16);
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
        : 'rgba(249, 115, 22, 0.22)'};
  background: ${({ $variant }) =>
    $variant === 'error' ? 'rgba(244, 67, 54, 0.14)' : 'rgba(0, 0, 0, 0.35)'};
  color: ${({ $variant }) =>
    $variant === 'error' ? '#fecaca' : theme.colors.starSecondary};
  font-size: ${theme.fontSizes.sm};
`

export const FooterHint = styled.span`
  margin-right: auto;
  font-size: ${theme.fontSizes.xs};
  color: ${theme.colors.heroTagline};
  align-self: center;
`

export const TriggerButton = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 6px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    color ${theme.transition.fast},
    background ${theme.transition.fast},
    border-color ${theme.transition.fast},
    transform ${theme.transition.fast};

  &:hover {
    color: ${theme.colors.heroText};
    background: rgba(249, 115, 22, 0.14);
    border-color: rgba(249, 115, 22, 0.5);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.25);
  }
`
