import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const SelectWrap = styled.span`
  position: relative;
  display: grid;
  min-width: 0;

  &::after {
    content: '';
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: 0.875rem;
    width: 0.5rem;
    height: 0.5rem;
    border: solid ${theme.colors.textSecondary};
    border-width: 0 2px 2px 0;
    transform: translateY(-70%) rotate(45deg);
    pointer-events: none;
  }

  @media (forced-colors: active) {
    &::after {
      display: none;
    }
  }
`

export const SelectField = styled.select`
  appearance: none;
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 0.5rem 0.75rem;
  padding-inline-end: 2.25rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.background};
  color: ${theme.colors.text};
  font: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (forced-colors: active) {
    appearance: auto;
    padding-inline-end: 0.75rem;
  }
`
