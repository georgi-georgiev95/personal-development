import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const StyledRegisterBox = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledRegisterCard = styled.div`
  position: relative;
  z-index: 1;
  padding: ${theme.spacing.lg};
  width: 440px;
  max-width: ${theme.layout.cardMaxWidth};
  border-radius: ${theme.borderRadius.xl};
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.02) 50%,
    rgba(255, 255, 255, 0.06) 100%
  );
  backdrop-filter: blur(24px) saturate(150%);
  -webkit-backdrop-filter: blur(24px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.45),
    0 0 80px rgba(249, 115, 22, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media (max-width: ${theme.breakpoint.tablet}) {
    width: 90vw;
    padding: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.lg};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    width: 98vw;
    padding: ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.md};
  }
`

export const OrbContainer = styled.div`
  position: absolute;
  top: -40px;
  right: -40px;
  width: 140px;
  height: 140px;
  opacity: 0.5;
  pointer-events: none;

  @media (max-width: ${theme.breakpoint.mobile}) {
    width: 100px;
    height: 100px;
    top: -30px;
    right: -30px;
  }
`

export const FormContent = styled.div`
  position: relative;
  z-index: 1;
`

export const StyledTitle = styled.h2`
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.heroText};
  font-family: ${theme.font.family};
  font-weight: 500;
  font-size: ${theme.fontSizes.xl};
  text-shadow: 0 0 20px rgba(249, 115, 22, 0.3);

  @media (max-width: ${theme.breakpoint.tablet}) {
    font-size: ${theme.fontSizes.lg};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: ${theme.fontSizes.md};
  }
`

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const InputIcon = styled.span`
  position: absolute;
  left: ${theme.spacing.sm};
  font-size: ${theme.fontSizes.sm};
  color: ${theme.colors.starSecondary};
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
`

export const StyledInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm}
    ${theme.spacing.xl};
  border: 1px solid rgba(249, 115, 22, 0.15);
  border-radius: ${theme.borderRadius.md};
  background: rgba(0, 0, 0, 0.3);
  color: ${theme.colors.textInverse};
  font-size: ${theme.fontSizes.md};
  font-family: inherit;
  outline: none;
  transition:
    border-color ${theme.transition.fast},
    box-shadow ${theme.transition.fast};
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 12px rgba(249, 115, 22, 0.15);
  }

  &::placeholder {
    color: ${theme.colors.muted};
  }
`

export const StyledButton = styled.button`
  width: 100%;
  padding: ${theme.spacing.sm};
  margin-top: ${theme.spacing.sm};
  border: none;
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.gradient};
  color: ${theme.colors.heroText};
  font-size: ${theme.fontSizes.lg};
  font-weight: bold;
  cursor: pointer;
  transition:
    opacity ${theme.transition.fast},
    box-shadow ${theme.transition.fast},
    transform ${theme.transition.fast};
  font-family: inherit;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    );
    pointer-events: none;
  }

  &:hover:not(:disabled) {
    opacity: 1;
    box-shadow: 0 0 24px rgba(249, 115, 22, 0.35);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const StyledLink = styled.a`
  display: block;
  width: 100%;
  text-align: center;
  margin-top: ${theme.spacing.sm};
  padding: ${theme.spacing.xs};
  color: ${theme.colors.starSecondary};
  font-weight: bold;
  text-decoration: none;
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.colors.starPrimary};
    text-decoration: none;
  }
`

export const ErrorMessage = styled.div`
  padding: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  background: rgba(244, 67, 54, 0.15);
  border: 1px solid rgba(244, 67, 54, 0.25);
  color: #fca5a5;
  font-weight: bold;
  font-size: ${theme.fontSizes.sm};
  text-align: center;
`

export const Row = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};

  & > * {
    flex: 1;
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    flex-direction: column;
  }
`

export const StyledSelect = styled.select`
  width: 100%;
  padding: ${theme.spacing.sm};
  text-align: center;
  text-align-last: center;
  border: 1px solid rgba(249, 115, 22, 0.15);
  border-radius: ${theme.borderRadius.md};
  background: rgba(0, 0, 0, 0.3);
  color: ${theme.colors.textInverse};
  font-size: ${theme.fontSizes.md};
  font-family: inherit;
  outline: none;
  transition:
    border-color ${theme.transition.fast},
    box-shadow ${theme.transition.fast};
  box-sizing: border-box;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 12px rgba(249, 115, 22, 0.15);
  }

  option {
    background: ${theme.colors.surface};
    color: ${theme.colors.textInverse};
  }
`
