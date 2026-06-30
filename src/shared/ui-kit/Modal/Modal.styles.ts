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
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.02) 50%,
      rgba(255, 255, 255, 0.07) 100%
    );
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow:
      0 10px 36px rgba(0, 0, 0, 0.55),
      0 0 70px rgba(249, 115, 22, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(24px) saturate(150%);
    -webkit-backdrop-filter: blur(24px) saturate(150%);
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
