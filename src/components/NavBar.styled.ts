import styled from 'styled-components'
import { theme } from '../theme'

// Fixed height for the navbar to calculate content offset
export const NAVBAR_HEIGHT = '56px'
export const NAVBAR_HEIGHT_MOBILE = '48px'

export const NavBarContainer = styled.nav`
  width: 100%;
  height: ${NAVBAR_HEIGHT};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${theme.colors.navbar};
  box-shadow: ${theme.boxShadow.sm};
  padding: 0 ${theme.spacing.lg};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  @media (max-width: 768px) {
    height: ${NAVBAR_HEIGHT_MOBILE};
    padding: 0 ${theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: 0 ${theme.spacing.sm};
  }
`

export const NavBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  @media (max-width: 480px) {
    gap: 0;
  }
`

export const NavBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};

  @media (max-width: 480px) {
    gap: 0;
  }
`
