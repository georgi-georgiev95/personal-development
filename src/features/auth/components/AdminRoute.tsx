import type React from 'react'
import { Navigate } from 'react-router-dom'
import { PageSpinner } from '@/shared/components/PageSpinner'
import { useAuth } from './useAuth'
import { useIsAdmin } from './useIsAdmin'

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth()
  const isAdmin = useIsAdmin()

  if (loading) return <PageSpinner />
  if (!user) return <Navigate to="/photobook" replace />
  if (isAdmin === null) return <PageSpinner />
  if (!isAdmin) return <Navigate to="/photobook" replace />

  return <>{children}</>
}
