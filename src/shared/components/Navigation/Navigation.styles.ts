import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  height: 64px;
  background: ${theme.colors.navbar};
  box-shadow: ${theme.boxShadow.sm};
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 0 ${theme.spacing.md};
    height: 56px;
  }

  @media (max-width: 480px) {
    padding: 0 ${theme.spacing.sm};
    height: 48px;
  }
`

export const NavBrand = styled.span`
  font-size: ${theme.fontSizes.lg};
  font-weight: 700;
  color: ${theme.colors.primary};
  letter-spacing: -0.5px;

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.md};
  }
`

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  @media (max-width: 768px) {
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
  border-radius: ${theme.borderRadius};
  transition:
    color 0.2s ease,
    background 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.primary};
    background: rgba(108, 99, 255, 0.08);
  }

  @media (max-width: 480px) {
    font-size: ${theme.fontSizes.xs};
    padding: ${theme.spacing.xs};
  }
`
