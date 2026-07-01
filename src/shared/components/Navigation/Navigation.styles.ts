import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Nav = styled.nav`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 40px 0;
  height: ${theme.layout.navHeight};
  background: transparent;
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.nav};

  @media (max-width: ${theme.breakpoint.tablet}) {
    padding: 14px ${theme.spacing.md} 0;
    height: ${theme.layout.navHeightTablet};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: 10px ${theme.spacing.sm} 0;
    height: ${theme.layout.navHeightMobile};
  }
`

export const NavLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const NavStatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${theme.fontSizes.xs};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);

  @media (max-width: ${theme.breakpoint.tablet}) {
    display: none;
  }
`

export const NavStatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: ${theme.borderRadius.full};
  background: ${theme.colors.success};
  animation: navPulseDot 2s ease-in-out infinite;

  @keyframes navPulseDot {
    0%,
    100% {
      opacity: 1;
      box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.5);
    }
    50% {
      opacity: 0.6;
      box-shadow: 0 0 0 4px rgba(74, 222, 128, 0);
    }
  }
`

export const NavBrandLink = styled.a`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
`

export const NavBrandPrefix = styled.span`
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: ${theme.letterSpacing.tight};
`

export const NavBrandName = styled.span`
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: ${theme.colors.heroText};
  letter-spacing: ${theme.letterSpacing.tight};
`

export const NavCursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 0.85em;
  background: ${theme.colors.primary};
  margin-left: 3px;
  vertical-align: -0.08em;
  animation: navCursorBlink 1s step-start infinite;

  @keyframes navCursorBlink {
    0%,
    45% {
      opacity: 1;
    }
    50%,
    95% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

export const NavRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
`

export const NavAuthRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`

export const NavUserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const NavSep = styled.span`
  display: inline-block;
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
`

export const NavLink = styled.a<{ $active?: boolean }>`
  text-decoration: none;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(255, 255, 255, 0.75)')};
  letter-spacing: ${theme.letterSpacing.wide};
  text-transform: uppercase;
  border-bottom: 1px solid
    ${({ $active }) => ($active ? theme.colors.primary : 'transparent')};
  padding-bottom: 2px;
  transition:
    color ${theme.transition.fast},
    border-color ${theme.transition.fast};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.heroText};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: ${theme.fontSizes.xs};
  }
`

export const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  padding: 0;
  transition: color ${theme.transition.fast};
  cursor: pointer;
  font-family: inherit;

  &:hover {
    color: rgba(255, 255, 255, 0.75);
  }
`
