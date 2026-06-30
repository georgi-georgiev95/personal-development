import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/components/useAuth'
import { ProfileModal } from '@/features/auth/components/ProfileModal'
import {
  Nav,
  NavBrand,
  NavLinks,
  NavPill,
  NavPillSeparator,
  NavLink,
  NavButton,
} from './Navigation.styles'

export const Navigation: React.FC = () => {
  const navigate = useNavigate()
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
      <NavBrand href="/" onClick={(e) => handleClick(e, '/')}>
        Georgi Georgiev
      </NavBrand>
      <NavLinks>
        <NavPill>
          {loading ? null : user ? (
            <>
              <ProfileModal />
              <NavPillSeparator />
              <NavButton onClick={handleSignOut}>Logout</NavButton>
            </>
          ) : (
            <>
              <NavLink href="/login" onClick={(e) => handleClick(e, '/login')}>
                Login
              </NavLink>
              <NavPillSeparator />
              <NavLink
                href="/register"
                onClick={(e) => handleClick(e, '/register')}
              >
                Register
              </NavLink>
            </>
          )}
        </NavPill>
      </NavLinks>
    </Nav>
  )
}
