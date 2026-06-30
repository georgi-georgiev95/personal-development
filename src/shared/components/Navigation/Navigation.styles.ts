import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  height: ${theme.layout.navHeight};
  background: transparent;
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.nav};

  @media (max-width: ${theme.breakpoint.tablet}) {
    padding: 0 ${theme.spacing.md};
    height: ${theme.layout.navHeightTablet};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: 0 ${theme.spacing.sm};
    height: ${theme.layout.navHeightMobile};
  }
`

export const NavBrand = styled.a`
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: ${theme.colors.textInverse};
  letter-spacing: ${theme.letterSpacing.tight};
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  text-decoration: none;
  cursor: pointer;

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: ${theme.fontSizes.md};
  }
`

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`

export const NavPill = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50px;
  padding: 6px 18px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  gap: 4px;

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: 4px 12px;
  }
`

export const NavPillSeparator = styled.span`
  display: inline-block;
  width: 28px;
  height: 1px;
  background: rgba(255, 255, 255, 0.28);
  margin: 0 6px;
`

export const NavLink = styled.a<{ $active?: boolean }>`
  text-decoration: none;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) =>
    $active ? theme.colors.primary : 'rgba(255, 255, 255, 0.7)'};
  padding: 4px 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color ${theme.transition.fast};
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: ${theme.fontSizes.xs};
    padding: 2px 6px;
  }
`

export const NavButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.fontSizes.sm};
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  padding: 4px 8px;
  transition: color ${theme.transition.fast};
  cursor: pointer;
  font-family: inherit;

  &:hover {
    color: rgba(255, 255, 255, 0.95);
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: ${theme.fontSizes.xs};
    padding: 2px 6px;
  }
`
