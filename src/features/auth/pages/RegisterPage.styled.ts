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
  width: ${theme.layout.cardMaxWidth};
  border-radius: ${theme.borderRadius.xl};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.boxShadow.md};

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

export const StyledTitle = styled.h2`
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.heroText};
  font-family: ${theme.font.family};
  font-weight: 500;
  font-size: ${theme.fontSizes.xl};

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
  color: ${theme.colors.muted};
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
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background};
  color: ${theme.colors.textInverse};
  font-size: ${theme.fontSizes.md};
  font-family: inherit;
  outline: none;
  transition: border-color ${theme.transition.fast};
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.colors.accent};
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
  transition: opacity ${theme.transition.fast};
  font-family: inherit;

  &:hover:not(:disabled) {
    opacity: 0.9;
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

  &:hover {
    text-decoration: underline;
  }
`

export const ErrorMessage = styled.div`
  padding: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  background: rgba(244, 67, 54, 0.15);
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
  padding: ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm}
    ${theme.spacing.xl};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background};
  color: ${theme.colors.textInverse};
  font-size: ${theme.fontSizes.md};
  font-family: inherit;
  outline: none;
  transition: border-color ${theme.transition.fast};
  box-sizing: border-box;
  appearance: none;
  cursor: pointer;

  &:focus {
    border-color: ${theme.colors.accent};
  }

  option {
    background: ${theme.colors.background};
    color: ${theme.colors.textInverse};
  }
`
