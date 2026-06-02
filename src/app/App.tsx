import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { Navigation } from '@/shared/components/Navigation'
import { AppRoot, AppFooter, AppContent } from './App.styles'
import { AppRoutes } from './routes'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoot>
          <Navigation />
          <AppContent>
            <AppRoutes />
          </AppContent>
          <AppFooter>Georgi Georgiev | All rights reserved 2026</AppFooter>
        </AppRoot>
      </Router>
    </AuthProvider>
  )
}

export default App
