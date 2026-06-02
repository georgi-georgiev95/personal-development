import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { RouteFallbackContainer, RouteFallbackText } from './routes.styles'

const HomePage = lazy(() => import('@/features/home/pages/HomePage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const OptimusPrime = lazy(() =>
  import('@/features/robot/pages/OptimusPrime').then((module) => ({
    default: module.OptimusPrime,
  }))
)

const RouteFallback = () => (
  <RouteFallbackContainer>
    <RouteFallbackText>Loading...</RouteFallbackText>
  </RouteFallbackContainer>
)

export const AppRoutes = () => (
  <ErrorBoundary>
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/robot" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/robot" element={<OptimusPrime />} />
        <Route path="*" element={<Navigate to="/robot" replace />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
)
