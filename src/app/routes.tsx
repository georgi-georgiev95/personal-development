import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { PageSpinner } from '@/shared/components/PageSpinner'
import { GuestOnlyRoute } from '@/features/auth/components/GuestOnlyRoute'

const HomePage = lazy(() => import('@/features/home/pages/HomePage'))
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const ProjectsPage = lazy(
  () => import('@/features/portfolio/pages/ProjectsPage')
)
const AboutPage = lazy(() => import('@/features/portfolio/pages/AboutPage'))
const EngineeringPage = lazy(
  () => import('@/features/portfolio/pages/EngineeringPage')
)
const ProjectDetailPage = lazy(
  () => import('@/features/portfolio/pages/ProjectDetailPage')
)
const PhotobookSection = lazy(() => import('./PhotobookSection'))

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
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/projects/*" element={<ProjectsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/engineering" element={<EngineeringPage />} />
        <Route path="/photobook/*" element={<PhotobookSection />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </ErrorBoundary>
)
