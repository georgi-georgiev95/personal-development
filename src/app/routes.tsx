import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { GuestOnlyRoute } from '@/features/auth/components/GuestOnlyRoute'
import { AdminRoute } from '@/features/auth/components/AdminRoute'
import { RouteFallbackContainer, Spinner } from './routes.styles'

const HomePage = lazy(() => import('@/features/home/pages/HomePage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const PhotobookPage = lazy(
  () => import('@/features/photobook/pages/PhotobookPage')
)
const PhotobookCmsPage = lazy(
  () => import('@/features/photobook/pages/PhotobookCmsPage')
)

const RouteFallback = () => (
  <RouteFallbackContainer>
    <Spinner />
  </RouteFallbackContainer>
)

export const AppRoutes = () => (
  <ErrorBoundary>
    <Suspense fallback={<RouteFallback />}>
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
        <Route path="/photobook" element={<PhotobookPage />} />
        <Route
          path="/photobook/cms"
          element={
            <AdminRoute>
              <PhotobookCmsPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
)
