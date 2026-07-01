import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { Navigation } from '@/shared/components/Navigation'
import { StarFieldBackground } from '@/shared/components/StarFieldBackground'
import { AppRoot, AppContent, CanvasBackground } from './App.styles'
import { AppRoutes } from './routes'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoot>
          <CanvasBackground>
            <StarFieldBackground />
          </CanvasBackground>
          <Navigation />
          <AppContent>
            <AppRoutes />
          </AppContent>
        </AppRoot>
      </Router>
    </AuthProvider>
  )
}

export default App
