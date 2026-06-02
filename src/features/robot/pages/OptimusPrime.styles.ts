import { styled } from '@linaria/react'

export const OptimusPrimeContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #111827, #1f2937);
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
  z-index: 10;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  &.hidden {
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease-out;
  }
`

export const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid #fbbf24;
  border-radius: 50%;
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
  color: #e5e7eb;
  font-size: 14px;
  letter-spacing: 0.5px;
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
    background: linear-gradient(90deg, #fbbf24, #f59e0b, #f97316);
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
  color: #9ca3af;
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
  line-height: 1.5;
`
