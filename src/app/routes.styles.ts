import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const RouteFallbackContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: ${theme.colors.background};
`

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.spinner}20;
  border-top-color: ${theme.colors.spinner};
  border-radius: ${theme.borderRadius.full};
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`
