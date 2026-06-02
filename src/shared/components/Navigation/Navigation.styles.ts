import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  height: ${theme.layout.navHeight};
  background: ${theme.colors.navbar};
  box-shadow: ${theme.boxShadow.sm};
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

export const NavBrand = styled.span`
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: ${theme.colors.primary};
  letter-spacing: ${theme.letterSpacing.tight};

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: ${theme.fontSizes.md};
  }
`

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoint.tablet}) {
    gap: ${theme.spacing.xs};
  }
`

export const NavLink = styled.a<{ $active?: boolean }>`
  text-decoration: none;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  transition:
    color ${theme.transition.fast},
    background ${theme.transition.fast};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.primary};
    background: rgba(108, 99, 255, 0.08);
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: ${theme.fontSizes.xs};
    padding: ${theme.spacing.xs};
  }
`

export const NavButton = styled.button`
  background: none;
  border: none;
  font-size: ${theme.fontSizes.sm};
  font-weight: 400;
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  transition:
    color ${theme.transition.fast},
    background ${theme.transition.fast};
  cursor: pointer;
  font-family: inherit;

  &:hover {
    color: ${theme.colors.primary};
    background: rgba(108, 99, 255, 0.08);
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    font-size: ${theme.fontSizes.xs};
    padding: ${theme.spacing.xs};
  }
`
