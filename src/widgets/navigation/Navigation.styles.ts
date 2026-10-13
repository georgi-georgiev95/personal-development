import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Nav = styled.nav`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 40px 0;
  min-height: ${theme.layout.navHeight};
  background: transparent;
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.nav};
  gap: ${theme.spacing.md};
  flex-shrink: 0;

  @media (max-width: 480px) {
    flex-wrap: wrap;
  }

  @media (max-width: ${theme.breakpoint.tablet}) {
    padding: 14px ${theme.spacing.md} 0;
    min-height: ${theme.layout.navHeightTablet};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding: 10px ${theme.spacing.sm} 0;
    min-height: ${theme.layout.navHeightMobile};
  }
`

export const NavLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 6px;

  @media (max-width: ${theme.breakpoint.mobile}) {
    padding-top: 11px;
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
  color: ${theme.colors.muted};
  letter-spacing: ${theme.letterSpacing.tight};

  @media (min-width: 1440px) {
    font-size: ${theme.fontSizes.xl};
  }
`

export const NavBrandName = styled.span`
  font-size: ${theme.fontSizes.lg};
  font-weight: 600;
  color: ${theme.colors.heroText};
  letter-spacing: ${theme.letterSpacing.tight};

  @media (min-width: 1440px) {
    font-size: ${theme.fontSizes.xl};
  }
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
  min-width: 0;
`

export const NavAuthRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: ${theme.breakpoint.tablet}) {
    gap: ${theme.spacing.sm};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    gap: ${theme.spacing.xs} ${theme.spacing.sm};
  }
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
  background: ${theme.colors.border};
`

export const NavLink = styled.a<{ $active?: boolean }>`
  text-decoration: none;
  font-size: ${theme.fontSizes.sm};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) =>
    $active ? theme.colors.text : theme.colors.textSecondary};
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
    letter-spacing: 0.03em;
  }
`

export const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.colors.muted};
  padding: 0;
  transition: color ${theme.transition.fast};
  cursor: pointer;
  font-family: inherit;

  &:hover {
    color: ${theme.colors.text};
  }

  @media (max-width: ${theme.breakpoint.mobile}) {
    min-height: 44px;
    padding: 10px 0;
  }
`

export const ThemeToggle = styled.button`
  display: grid;
  align-items: center;
  flex-shrink: 0;
  width: 48px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;

  span {
    position: relative;
    display: block;
    width: 48px;
    height: 24px;
    border-radius: 999px;
    background: #e8e0d4;
    outline: 1px solid #82715c;
    box-shadow:
      3px 3px 7px rgb(0 0 0 / 12%),
      -3px -3px 7px rgb(255 255 255 / 65%),
      inset 0 0 2px rgb(255 230 0 / 30%);
    pointer-events: none;
  }

  span::before,
  span::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    transition:
      transform 150ms ease-out,
      opacity 150ms ease-out;
  }

  span::before {
    top: 4px;
    left: 4px;
    transform: translateX(24px);
    background: #ffe600;
    box-shadow:
      inset 0 0 0 1px #8a7500,
      0 0 7px 2px rgb(255 230 0 / 35%);
  }

  span::after {
    top: 3px;
    left: 9px;
    transform: translateX(24px);
    background: #171715;
    opacity: 0;
  }

  &[aria-checked='true'] span {
    background: #171715;
    outline: 1px solid #68635b;
    box-shadow:
      3px 3px 7px rgb(0 0 0 / 55%),
      -3px -3px 7px rgb(255 255 255 / 3%);
  }

  &[aria-checked='true'] span::before {
    transform: translateX(0);
    background: #fff;
    box-shadow: 0 0 4px rgb(255 255 255 / 15%);
  }

  &[aria-checked='true'] span::after {
    transform: translateX(0);
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    span::before,
    span::after {
      transition: none;
    }
  }
`
