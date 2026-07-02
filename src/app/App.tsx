import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { Navigation } from '@/widgets/navigation'
import { AppRoot, AppContent, CanvasBackground, SkipLink } from './App.styles'
import { AppRoutes } from './routes'

// three.js + react-three-fiber (~900KB) load after first paint instead of
// blocking it — the star field is a decorative background. The photobook
// DI bindings live in PhotobookSection (lazy) for the same reason: they
// would drag the Firestore SDK into the entry chunk.
const StarFieldBackground = lazy(
  () => import('@/shared/components/StarFieldBackground/StarFieldBackground')
)

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoot>
          <SkipLink href="#main-content">Skip to main content</SkipLink>
          <CanvasBackground aria-hidden="true">
            <Suspense fallback={null}>
              <StarFieldBackground />
            </Suspense>
          </CanvasBackground>
          <Navigation />
          <AppContent id="main-content">
            <AppRoutes />
          </AppContent>
        </AppRoot>
      </Router>
    </AuthProvider>
  )
}

export default App
