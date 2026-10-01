import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

interface GuestOnlyRouteProps {
  children: ReactNode
}

export function GuestOnlyRoute({ children }: GuestOnlyRouteProps) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (user) return <Navigate to="/" replace />

  return <>{children}</>
}
