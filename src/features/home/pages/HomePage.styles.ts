import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const HomeCanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

export const HintsOverlay = styled.div`
  position: absolute;
  top: ${theme.spacing.md};
  left: ${theme.spacing.md};
  background: ${theme.colors.overlay};
  color: ${theme.colors.cardBg};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.lg};
  line-height: ${theme.lineHeight.normal};
  pointer-events: none;
  user-select: none;
`

export const HintsTitle = styled.div`
  font-weight: 700;
  margin-bottom: ${theme.spacing.xs};
`

export const HintItem = styled.div`
  margin-bottom: ${theme.spacing.xs};

  &:last-child {
    margin-bottom: 0;
  }
`
