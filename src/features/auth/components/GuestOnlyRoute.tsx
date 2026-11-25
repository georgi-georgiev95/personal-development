import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

interface GuestOnlyRouteProps {
  children: ReactNode
}

export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const { user, loading } = useAuth()
  const { state } = useLocation()

  if (loading) return null
  if (user)
    return state?.resumePlan ? (
      <Navigate to="/workspace/tasks/new" state={state} replace />
    ) : (
      <Navigate to="/" replace />
    )

  return <>{children}</>
}
