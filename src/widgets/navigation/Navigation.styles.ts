import { styled } from '@linaria/react'
import { theme } from '@/shared/styles/theme'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(24px, 5vw, 72px);
  min-height: ${theme.layout.navHeight};
  background: ${theme.colors.background};
  position: sticky;
  top: 0;
  z-index: ${theme.zIndex.nav};
  gap: ${theme.spacing.md};
  flex-shrink: 0;

  @media (max-width: ${theme.breakpoint.tablet}) {
    padding: 0 28px;
    min-height: ${theme.layout.navHeightTablet};
  }

  @media (max-width: 767px) {
    padding: 0 20px;
    min-height: 64px;
    flex-wrap: wrap;
    row-gap: 8px;
  }
`

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
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
  align-items: center;
  gap: ${theme.spacing.lg};
  min-width: 0;

  @media (max-width: 767px) {
    gap: ${theme.spacing.sm};
  }
`

export const NavAuthRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 767px) {
    display: none;
  }
`

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(16px, 2.2vw, 32px);
  flex-wrap: nowrap;
  justify-content: flex-end;

  @media (max-width: ${theme.breakpoint.tablet}) {
    gap: ${theme.spacing.sm};
  }

  @media (max-width: 767px) {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: ${theme.zIndex.nav};
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    justify-content: stretch;
    min-height: calc(62px + env(safe-area-inset-bottom));
    padding: 6px 8px env(safe-area-inset-bottom);
    border-top: 1px solid ${theme.colors.border};
    background: ${theme.colors.surface};
    box-shadow: 0 -8px 24px rgb(0 0 0 / 5%);

    > a {
      display: grid;
      place-items: center;
      min-height: 48px;
      padding: 0 2px;
      border: 0;
      font-size: 10px;
      letter-spacing: 0.03em;
      text-align: center;
      text-transform: none;
    }

    > button {
      display: none;
    }
  }
`

export const ProfileNavItem = styled.div`
  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
      min-width: 0;
      min-height: 48px;
    }

    button span:last-child {
      max-width: 76px;
      overflow: hidden;
      font-size: 9px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    button span:first-child {
      width: 22px;
      height: 22px;
      font-size: 9px;
    }
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

  @media (max-width: 767px) {
    font-size: ${theme.fontSizes.sm};
  }
`

export const MenuToggle = styled.button`
  display: none;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  min-width: 44px;
  min-height: 44px;
  padding: 0 14px;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  font: inherit;
  font-size: ${theme.fontSizes.sm};
  cursor: pointer;

  @media (max-width: 767px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`

export const MenuBackdrop = styled.button`
  position: fixed;
  inset: 64px 0 0;
  z-index: calc(${theme.zIndex.nav} + 1);
  border: 0;
  background: rgb(0 0 0 / 28%);
  cursor: default;

  @media (min-width: 768px) {
    display: none;
  }
`

export const MobileMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: calc(${theme.zIndex.nav} + 2);
  width: 100%;
  padding: 16px 20px 20px;
  border-top: 1px solid ${theme.colors.border};
  border-bottom: 1px solid ${theme.colors.border};
  background: ${theme.colors.surface};
  box-shadow: ${theme.boxShadow.md};

  > div:first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px 12px;
    color: ${theme.colors.text};
    font-size: 14px;
  }

  > div + div {
    display: grid;
    gap: 4px;
    padding-top: 12px;
    border-top: 1px solid ${theme.colors.border};
  }

  > div + div > span {
    padding: 4px 12px 8px;
    color: ${theme.colors.textSecondary};
    font-size: 12px;
  }

  a,
  button:not([role='switch']) {
    display: flex;
    align-items: center;
    min-height: 46px;
    padding: 0 12px;
    border: 0;
    border-radius: 8px;
    color: ${theme.colors.text};
    font-size: 14px;
    letter-spacing: 0;
    text-decoration: none;
    text-transform: none;
    text-align: left;
  }

  a:last-child {
    color: ${theme.colors.textOnAccent};
    background: ${theme.colors.primary};
    font-weight: 600;
  }

  a:hover,
  button:not([role='switch']):hover {
    opacity: 0.85;
  }

  @media (min-width: 768px) {
    display: none;
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

  @media (max-width: 767px) {
    min-height: 44px;
    padding: 10px 0;
  }
`

export const ThemeToggle = styled.button`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  background: ${theme.colors.surface};
  color: ${theme.colors.text};
  cursor: pointer;

  span::before {
    content: '☀';
    font-size: 23px;
    line-height: 1;
  }

  &[aria-checked='true'] span::before {
    content: '☾';
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }
`
