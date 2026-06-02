import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Nav, NavBrand, NavLinks, NavLink } from './Navigation.styles'

type RouteItem = {
  path: string
  label: string
}

const routes: RouteItem[] = [
  { path: '/robot', label: 'Robot' },
  { path: '/home', label: 'Home' },
  { path: '/login', label: 'Login' },
  { path: '/register', label: 'Register' },
]

export const Navigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault()
    navigate(path)
  }

  return (
    <Nav>
      <NavBrand>Playground</NavBrand>
      <NavLinks>
        {routes.map((route) => (
          <NavLink
            key={route.path}
            href={route.path}
            $active={location.pathname === route.path}
            onClick={(e) => handleClick(e, route.path)}
          >
            {route.label}
          </NavLink>
        ))}
      </NavLinks>
    </Nav>
  )
}
