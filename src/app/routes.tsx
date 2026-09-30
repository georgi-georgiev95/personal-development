import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { PageSpinner } from '@/shared/components/PageSpinner'
import { GuestOnlyRoute } from '@/features/auth/components/GuestOnlyRoute'

const HomePage = lazy(() => import('@/features/home/pages/HomePage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const AIDeliveryLabPage = lazy(
  () => import('@/features/ai-delivery-lab/pages/AIDeliveryLabPage')
)

export const AppRoutes = () => (
  <ErrorBoundary>
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnlyRoute>
              <RegisterPage />
            </GuestOnlyRoute>
          }
        />
        <Route path="/demo" element={<AIDeliveryLabPage />} />
        {/* Keep the old demo URL working while retired portfolio URLs return home. */}
        <Route
          path="/engineering/ai-delivery"
          element={<Navigate to="/demo" replace />}
        />
        <Route path="/projects/*" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<Navigate to="/" replace />} />
        <Route path="/engineering/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
)
