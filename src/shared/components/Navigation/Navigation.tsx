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

const publicRoutes: RouteItem[] = [
  { path: '/robot', label: 'Robot' },
  { path: '/home', label: 'Home' },
]

const guestRoutes: RouteItem[] = [
  { path: '/login', label: 'Login' },
  { path: '/register', label: 'Register' },
]

export const Navigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: string
  ) => {
    e.preventDefault()
    navigate(path)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/robot')
  }

  const visibleRoutes = user ? publicRoutes : [...publicRoutes, ...guestRoutes]

  return (
    <Nav>
      <NavBrand>Playground</NavBrand>
      <NavLinks>
        {visibleRoutes.map((route) => (
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
