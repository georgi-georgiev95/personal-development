import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/components/useAuth'
import {
  Nav,
  NavBrand,
  NavLinks,
  NavLink,
  NavButton,
} from './Navigation.styles'

type RouteItem = {
  path: string
  label: string
}

const guestRoutes: RouteItem[] = [
  { path: '/login', label: 'Login' },
  { path: '/register', label: 'Register' },
]

export const Navigation: React.FC = () => {
  const location = useLocation()
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

  const visibleRoutes = user ? [] : guestRoutes

  return (
    <Nav>
      <NavBrand href="/" onClick={(e) => handleClick(e, '/')}>
        Georgi Georgiev
      </NavBrand>
      <NavLinks>
        {loading
          ? null
          : visibleRoutes.map((route) => (
              <NavLink
                key={route.path}
                href={route.path}
                $active={location.pathname === route.path}
                onClick={(e) => handleClick(e, route.path)}
              >
                {route.label}
              </NavLink>
            ))}
        {user && <NavButton onClick={handleSignOut}>Logout</NavButton>}
      </NavLinks>
    </Nav>
  )
}
