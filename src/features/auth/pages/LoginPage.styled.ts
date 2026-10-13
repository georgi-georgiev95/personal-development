import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const StyledLoginBox = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md};
`

export const StyledLoginCard = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: ${theme.layout.cardMaxWidth};
  padding: 40px 32px 32px;
  border-radius: ${theme.borderRadius.xl};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.boxShadow.card};

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
  }

  &::before {
    top: 18px;
    right: 18px;
    border-top: 1px solid ${theme.colors.primary};
    border-right: 1px solid ${theme.colors.primary};
  }

  &::after {
    bottom: 18px;
    left: 18px;
    border-bottom: 1px solid ${theme.colors.primary};
    border-left: 1px solid ${theme.colors.primary};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: 32px 20px 24px;
  }
`

export const FormContent = styled.div`
  position: relative;
  z-index: 1;
`

export const TitleBlock = styled.div`
  text-align: center;
  margin-bottom: 28px;
`

export const Eyebrow = styled.p`
  margin: 0 0 10px;
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: 0.16em;
  text-transform: uppercase;
`

export const StyledTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  font-family: ${theme.font.family};
  font-weight: 700;
  font-size: 26px;
  text-shadow: none;

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: 22px;
  }
`

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const FieldLabel = styled.label`
  margin-top: ${theme.spacing.xs};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
  font-weight: 600;
`

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const InputIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.primary};
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledInput = styled.input`
  width: 100%;
  padding: 13px 14px 13px 38px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.cardBg};
  color: ${theme.colors.text};
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition:
    border-color ${theme.transition.fast},
    box-shadow ${theme.transition.fast};
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.overlay};
  }

  &::placeholder {
    color: ${theme.colors.muted};
  }
`

export const StyledButton = styled.button`
  width: 100%;
  margin-top: 6px;
  padding: 14px;
  border: none;
  border-radius: ${theme.borderRadius.sm};
  background: ${theme.colors.primary};
  color: ${theme.colors.textOnAccent};
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    box-shadow ${theme.transition.fast},
    transform ${theme.transition.fast};
  font-family: inherit;

  &:hover:not(:disabled) {
    box-shadow: ${theme.boxShadow.sm};
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

export const BottomText = styled.p`
  margin: 18px 0 0;
  width: 100%;
  text-align: center;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSizes.sm};
`

export const StyledLink = styled(Link)`
  color: ${theme.colors.primary};
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.colors.accentHover};
  }
`

export const ErrorMessage = styled.div`
  padding: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.errorBg};
  border: 1px solid ${theme.colors.error};
  color: ${theme.colors.error};
  font-weight: bold;
  font-size: ${theme.fontSizes.sm};
  text-align: center;
`
