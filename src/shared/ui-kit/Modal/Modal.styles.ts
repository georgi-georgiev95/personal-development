import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${theme.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${theme.zIndex.overlay};
  animation: fadeIn ${theme.transition.normal};

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export const Dialog = styled.div`
  position: relative;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.boxShadow.md};
  padding: ${theme.spacing.lg};
  width: 100%;
  max-width: 400px;
  color: ${theme.colors.textInverse};

  @media (max-width: ${theme.breakpoint.mobile}) {
    margin: ${theme.spacing.md};
    padding: ${theme.spacing.md};
  }

  &.profile-modal-dialog {
    max-width: 420px;
    padding: 32px;
    border-radius: ${theme.borderRadius.xl};
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 40px 90px -20px rgba(0, 0, 0, 0.85);

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
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`

export const Title = styled.h2`
  margin: 0;
  font-size: ${theme.fontSizes.lg};
  color: ${theme.colors.textInverse};
`

export const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  background: none;
  border: none;
  color: ${theme.colors.muted};
  cursor: pointer;
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.colors.textInverse};
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
`
