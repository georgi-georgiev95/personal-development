import styled from 'styled-components'
import { theme } from '@/theme'

export const StyledHomeBox = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${theme.colors.gradient};
`

export const HomeContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: calc(56px + ${theme.spacing.lg}) ${theme.spacing.lg}
    ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: calc(48px + ${theme.spacing.md}) ${theme.spacing.md}
      ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: calc(48px + ${theme.spacing.sm}) ${theme.spacing.sm}
      ${theme.spacing.sm};
  }
`

export const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${theme.spacing.lg};
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`
