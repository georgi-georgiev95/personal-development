import React, { lazy, Suspense, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/components/useAuth'
import { Skeleton } from '@/shared/ui-kit'
import { useThemePreference } from '@/shared/styles/themePreference'
import {
  Nav,
  NavLeft,
  NavBrandLink,
  NavBrandName,
  NavRight,
  NavLinks,
  NavAuthRow,
  NavUserRow,
  NavSep,
  NavLink,
  NavButton,
  ThemeToggle,
  MenuToggle,
  MobileMenu,
  ProfileNavItem,
  MenuBackdrop,
} from './Navigation.styles'

// ProfileModal reaches Firestore through the user entity; loading it lazily
// keeps that SDK out of the entry chunk for signed-out visitors.
const ProfileModal = lazy(() =>
  import('@/features/auth/components/ProfileModal').then((m) => ({
    default: m.ProfileModal,
  }))
)

const ProfileModalFallback = () => (
  <>
    <Skeleton variant="circle" width="26px" height="26px" />
    <Skeleton variant="text" width="72px" />
  </>
)

export function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, signOut } = useAuth()
  const { mode, toggle } = useThemePreference()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault()
    setMenuOpen(false)
    navigate(path)
  }

  const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <Nav
      onKeyDown={(event) => {
        if (event.key === 'Escape') setMenuOpen(false)
      }}
    >
      <NavLeft>
        <NavBrandLink href="/" onClick={(e) => handleClick(e, '/')}>
          <NavBrandName>Daywise</NavBrandName>
        </NavBrandLink>
      </NavLeft>
      <NavRight>
        <NavLinks aria-label="Primary navigation">
          <NavLink
            href="/"
            $active={location.pathname === '/'}
            onClick={(e) => handleClick(e, '/')}
          >
            Home
          </NavLink>
          <NavLink
            href="/demo"
            $active={location.pathname.startsWith('/demo')}
            onClick={(e) => handleClick(e, '/demo')}
          >
            Explore
          </NavLink>
          <NavLink
            href="/workspace/tasks"
            $active={
              location.pathname === '/workspace' ||
              (location.pathname.startsWith('/workspace/tasks') &&
                location.pathname !== '/workspace/tasks/new')
            }
            onClick={(e) => handleClick(e, '/workspace/tasks')}
          >
            My space
          </NavLink>
          {user ? (
            <ProfileNavItem>
              <Suspense fallback={<ProfileModalFallback />}>
                <ProfileModal />
              </Suspense>
            </ProfileNavItem>
          ) : (
            <NavLink
              href="/login"
              $active={location.pathname === '/login'}
              onClick={(e) => handleClick(e, '/login')}
            >
              Profile
            </NavLink>
          )}
          <ThemeToggle
            type="button"
            role="switch"
            aria-checked={mode === 'dark'}
            aria-label="Dark theme"
            title={`Switch to ${mode === 'light' ? 'dark' : 'light'} theme`}
            onClick={toggle}
          >
            <span aria-hidden="true" />
          </ThemeToggle>
        </NavLinks>
        <NavAuthRow>
          {loading ? null : user ? (
            <NavUserRow>
              <NavButton onClick={handleSignOut}>Log out</NavButton>
            </NavUserRow>
          ) : (
            <>
              <NavLink
                href="/login"
                $active={location.pathname === '/login'}
                onClick={(e) => handleClick(e, '/login')}
              >
                Login
              </NavLink>
              <NavSep />
              <NavLink
                href="/register"
                $active={location.pathname === '/register'}
                onClick={(e) => handleClick(e, '/register')}
              >
                Register
              </NavLink>
            </>
          )}
        </NavAuthRow>
        <MenuToggle
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path d="m6 6 12 12M6 18 18 6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </MenuToggle>
      </NavRight>
      {menuOpen && (
        <>
          <MenuBackdrop
            aria-label="Dismiss menu"
            onClick={() => setMenuOpen(false)}
          />
          <MobileMenu id="mobile-navigation-menu">
            <div>
              <span>Appearance</span>
              <ThemeToggle
                type="button"
                role="switch"
                aria-checked={mode === 'dark'}
                aria-label="Dark theme"
                title={`Switch to ${mode === 'light' ? 'dark' : 'light'} theme`}
                onClick={toggle}
              >
                <span aria-hidden="true" />
              </ThemeToggle>
            </div>
            <div>
              <span>Your account</span>
              {user ? (
                <NavButton onClick={handleSignOut}>Log out</NavButton>
              ) : (
                <>
                  <NavLink
                    href="/login"
                    $active={location.pathname === '/login'}
                    onClick={(e) => handleClick(e, '/login')}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    href="/register"
                    $active={location.pathname === '/register'}
                    onClick={(e) => handleClick(e, '/register')}
                  >
                    Create an account
                  </NavLink>
                </>
              )}
            </div>
          </MobileMenu>
        </>
      )}
    </Nav>
  )
}
