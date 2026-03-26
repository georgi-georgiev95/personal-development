import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import { PlaygroundPage } from './pages/PlaygroundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AppRoot, AppFooter } from './App.styles'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoot>
          <Routes>
            <Route path="/" element={<PlaygroundPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <AppFooter>Georgi Georgiev | All rights reserved 2026</AppFooter>
        </AppRoot>
      </Router>
    </AuthProvider>
  )
}

export default App
