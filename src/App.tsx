import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AppRoot, AppFooter, AppContent } from './App.styles'
import HomePage from './pages/HomePage'
import { OptimusPrime } from './pages/OptimusPrime'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoot>
          <AppContent>
            <Routes>
              <Route path="/" element={<Navigate to="/robot" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/robot" element={<OptimusPrime />} />
              <Route path="*" element={<Navigate to="/robot" replace />} />
            </Routes>
          </AppContent>
          <AppFooter>Georgi Georgiev | All rights reserved 2026</AppFooter>
        </AppRoot>
      </Router>
    </AuthProvider>
  )
}

export default App
