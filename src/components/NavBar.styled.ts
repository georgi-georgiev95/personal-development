import styled from 'styled-components'
import { theme } from '../theme'

export const NavBarContainer = styled.nav`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${theme.colors.navbar};
  box-shadow: ${theme.boxShadow.sm};
  padding: 0.5rem 1.5rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
  @media (max-width: 480px) {
    padding: 0.5rem 0.5rem;
  }
`

export const NavBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const NavBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const NavIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`
