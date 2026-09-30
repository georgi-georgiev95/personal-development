import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { Navigation } from '@/widgets/navigation'
import { AppRoot, AppContent, SkipLink } from './App.styles'
import { AppRoutes } from './routes'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoot>
          <SkipLink href="#main-content">Skip to main content</SkipLink>
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
