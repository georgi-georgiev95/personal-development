import React, { lazy, Suspense } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/components/useAuth'
import { Skeleton } from '@/shared/ui-kit'
import {
  Nav,
  NavLeft,
  NavBrandLink,
  NavBrandPrefix,
  NavBrandName,
  NavCursor,
  NavStatusRow,
  NavStatusDot,
  NavRight,
  NavAuthRow,
  NavUserRow,
  NavSep,
  NavLink,
  NavButton,
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

export const Navigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, signOut } = useAuth()

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault()
    navigate(path)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <Nav>
      <NavLeft>
        <NavBrandLink href="/" onClick={(e) => handleClick(e, '/')}>
          <NavBrandPrefix>~/</NavBrandPrefix>
          <NavBrandName>georgi-georgiev</NavBrandName>
          <NavCursor />
        </NavBrandLink>
        <NavStatusRow>
          <NavStatusDot />
          status: online
        </NavStatusRow>
      </NavLeft>
      <NavRight>
        <NavAuthRow>
          {loading ? null : user ? (
            <NavUserRow>
              <Suspense fallback={<ProfileModalFallback />}>
                <ProfileModal />
              </Suspense>
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
      </NavRight>
    </Nav>
  )
}
