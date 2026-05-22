import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/components/useAuth'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/auth'
import PlaygroundCanvas from '@/components/PlaygroundCanvas/PlaygroundCanvas'
import {
  PageWrapper,
  NavBar,
  AppTitle,
  NavActions,
  NavButton,
  AuthStatus,
  ScrollSection,
  SectionContent,
  SectionLabel,
  SectionTitle,
  SectionText,
  ScrollHint,
} from './PlaygroundPage.styles'

export const PlaygroundPage: React.FC = () => {
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 60) setScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async (): Promise<void> => {
    await signOut(auth)
  }

  return (
    <PageWrapper>
      <NavBar>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <AppTitle>G. Georgiev</AppTitle>
        </Link>
        <NavActions>
          <Link
            to="/optimus"
            style={{ textDecoration: 'none', marginRight: 8 }}
          >
            <NavButton as="span">Optimus</NavButton>
          </Link>
          {user && <AuthStatus>{user.displayName ?? user.email}</AuthStatus>}
          {user ? (
            <NavButton onClick={handleLogout}>Logout</NavButton>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <NavButton as="span">Login</NavButton>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <NavButton as="span">Register</NavButton>
              </Link>
            </>
          )}
        </NavActions>
      </NavBar>

      <PlaygroundCanvas />

      <ScrollSection>
        <SectionContent>
          <SectionLabel>Welcome</SectionLabel>
          <SectionTitle>Widget Playground</SectionTitle>
          <SectionText>
            A canvas where independent widgets live. Drag, resize, and compose
            your own workspace — no setup required.
          </SectionText>
        </SectionContent>
        <ScrollHint
          style={{ opacity: scrolled ? 0 : 1 }}
          aria-label="Scroll down"
        >
          <span>Scroll</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </ScrollHint>
      </ScrollSection>

      <ScrollSection style={{ justifyContent: 'flex-end' }}>
        <SectionContent>
          <SectionLabel>Build</SectionLabel>
          <SectionTitle>Snap Widgets Together</SectionTitle>
          <SectionText>
            Every widget is a self-contained MVVM unit. Add as many as you need
            and let them communicate through the EventBus — never coupled,
            always composable.
          </SectionText>
        </SectionContent>
      </ScrollSection>

      <ScrollSection style={{ justifyContent: 'flex-start' }}>
        <SectionContent>
          <SectionLabel>Customize</SectionLabel>
          <SectionTitle>Make It Yours</SectionTitle>
          <SectionText>
            Theme, resize, or rearrange. The grid adapts to desktop, tablet, and
            mobile out of the box — your layout, your rules.
          </SectionText>
        </SectionContent>
      </ScrollSection>

      <ScrollSection>
        <SectionContent>
          <SectionLabel>Ship It</SectionLabel>
          <SectionTitle>Take Any Widget Anywhere</SectionTitle>
          <SectionText>
            Each widget is portable. Copy it into any project and it brings its
            own logic, styles, and tests along for the ride.
          </SectionText>
        </SectionContent>
      </ScrollSection>
    </PageWrapper>
  )
}
