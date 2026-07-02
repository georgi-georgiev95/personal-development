import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const IconButtonRoot = styled.button<{
  $variant: 'default' | 'danger'
  $active: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.full};
  border: 1px solid ${theme.colors.border};
  background: ${({ $active }) =>
    $active ? 'rgba(45, 212, 191, 0.15)' : 'transparent'};
  color: ${({ $variant, $active }) =>
    $variant === 'danger'
      ? theme.colors.error
      : $active
        ? theme.colors.primary
        : theme.colors.muted};
  cursor: pointer;
  transition:
    color ${theme.transition.fast},
    background ${theme.transition.fast},
    transform ${theme.transition.fast};

  &:hover {
    transform: translateY(-1px);
    color: ${({ $variant }) =>
      $variant === 'danger' ? theme.colors.error : theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`
