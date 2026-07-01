import { styled } from '@linaria/react'
import { Link } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'

export const StyledRegisterBox = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md};
`

export const StyledRegisterCard = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 40px 32px 32px;
  border-radius: ${theme.borderRadius.xl};
  background: ${theme.colors.surface};
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 40px 90px -20px rgba(0, 0, 0, 0.85);
  max-height: 90vh;
  overflow-y: auto;

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
    border-top: 1px solid rgba(45, 212, 191, 0.4);
    border-right: 1px solid rgba(45, 212, 191, 0.4);
  }

  &::after {
    bottom: 18px;
    left: 18px;
    border-bottom: 1px solid rgba(45, 212, 191, 0.4);
    border-left: 1px solid rgba(45, 212, 191, 0.4);
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
  margin-bottom: 26px;
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
  color: #fff;
  font-family: ${theme.font.family};
  font-weight: 700;
  font-size: 26px;
  text-shadow: 0 0 26px rgba(45, 212, 191, 0.35);

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: 22px;
  }
`

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  color: rgba(45, 212, 191, 0.75);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledInput = styled.input`
  width: 100%;
  padding: 13px 14px 13px 38px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition:
    border-color ${theme.transition.fast},
    box-shadow ${theme.transition.fast};
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 12px rgba(45, 212, 191, 0.18);
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
  border-radius: 5px;
  background: ${theme.colors.gradient};
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
    box-shadow: 0 0 24px rgba(45, 212, 191, 0.3);
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
  color: rgba(255, 255, 255, 0.5);
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
  background: rgba(244, 67, 54, 0.15);
  border: 1px solid rgba(244, 67, 54, 0.25);
  color: #fca5a5;
  font-weight: bold;
  font-size: ${theme.fontSizes.sm};
  text-align: center;
`

export const Row = styled.div`
  display: flex;
  gap: 10px;

  & > * {
    flex: 1;
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    flex-direction: column;
  }
`

export const StyledSelect = styled.select`
  width: 100%;
  padding: 13px 10px;
  text-align: center;
  text-align-last: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.85);
  font-size: 12.5px;
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
    box-shadow: 0 0 12px rgba(45, 212, 191, 0.18);
  }

  option {
    background: ${theme.colors.surface};
    color: ${theme.colors.textInverse};
  }
`
