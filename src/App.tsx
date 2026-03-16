import React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { AppContainer, AppContent, AppFooter } from './App.styled'
import { AuthProvider, useAuth } from './components/AuthProvider'
import { ProfileProvider } from './components/ProfileProvider'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <>{children}</> : <Navigate to="/login" />
}

const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return !user ? <>{children}</> : <Navigate to="/" />
}

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <ProfileProvider>
          <AppContainer>
            <AppContent>
              <Router>
                <Routes>
                  <Route
                    path="/login"
                    element={
                      <GuestRoute>
                        <LoginPage />
                      </GuestRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <GuestRoute>
                        <RegisterPage />
                      </GuestRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Router>
            </AppContent>
            <AppFooter>Georgi Georgiev | All rights reserved 2026</AppFooter>
          </AppContainer>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
