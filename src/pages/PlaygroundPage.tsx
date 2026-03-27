import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/components/useAuth'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/auth'
import {
  PageWrapper,
  NavBar,
  AppTitle,
  NavActions,
  NavButton,
  AuthStatus,
  HeroSection,
  HeroTitle,
  HeroSubtitle,
} from './PlaygroundPage.styles'

export const PlaygroundPage: React.FC = () => {
  const { user } = useAuth()

  const handleLogout = async (): Promise<void> => {
    await signOut(auth)
  }

  return (
    <PageWrapper>
      <NavBar>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <AppTitle>My App</AppTitle>
        </Link>
        <NavActions>
          {user && <AuthStatus>{user.displayName ?? user.email}</AuthStatus>}
          {user ? (
            <NavButton onClick={handleLogout}>Logout</NavButton>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <NavButton as="span">Login</NavButton>
            </Link>
          )}
        </NavActions>
      </NavBar>

      <HeroSection>
        <HeroTitle>
          {user ? `Welcome back, ${user.displayName ?? user.email}` : 'Welcome'}
        </HeroTitle>
        <HeroSubtitle>
          {user
            ? 'You are logged in.'
            : 'Please log in or register to get started.'}
        </HeroSubtitle>
      </HeroSection>
    </PageWrapper>
  )
}
