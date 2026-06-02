import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const OptimusPrimeContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, ${theme.colors.surface}, #1f2937);
`

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: ${theme.zIndex.overlay};
  font-family: ${theme.font.family};

  &.hidden {
    opacity: 0;
    pointer-events: none;
    transition: opacity ${theme.transition.normal};
  }
`

export const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.md};
`

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid ${theme.colors.spinner};
  border-radius: ${theme.borderRadius.full};
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const LoadingText = styled.p`
  color: ${theme.colors.textInverse};
  font-size: ${theme.fontSizes.sm};
  letter-spacing: ${theme.letterSpacing.wide};
  margin: 0;
  text-transform: uppercase;
  font-weight: 500;
`

export const ProgressBar = styled.div`
  width: 200px;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    background: linear-gradient(
      90deg,
      ${theme.colors.spinner},
      #f59e0b,
      #f97316
    );
    animation: progress 2s ease-in-out infinite;
  }

  @keyframes progress {
    0% {
      width: 0%;
    }
    50% {
      width: 100%;
    }
    100% {
      width: 100%;
    }
  }
`

export const HintText = styled.p`
  color: ${theme.colors.muted};
  font-size: ${theme.fontSizes.xs};
  margin-top: ${theme.spacing.xs};
  text-align: center;
  line-height: ${theme.lineHeight.relaxed};
`

export const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  position: relative;
  background: linear-gradient(to bottom, ${theme.colors.surface}, #1f2937);
`

export const PageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(to bottom, ${theme.colors.surface}, #1f2937);
  color: ${theme.colors.textInverse};
  font-family: ${theme.font.family};
  font-size: ${theme.fontSizes.sm};
  text-align: center;
  padding: ${theme.spacing.md};
`

export const LoadingLabelContainer = styled.div`
  min-width: 132px;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  background: rgba(17, 24, 39, 0.82);
  color: ${theme.colors.textInverse};
  font-family: ${theme.font.family};
  font-size: ${theme.fontSizes.xs};
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  pointer-events: none;
`
