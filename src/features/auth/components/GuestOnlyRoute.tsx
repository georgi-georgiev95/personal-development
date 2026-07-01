import type React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export const GuestOnlyRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth()

  if (loading) return null
  if (user) return <Navigate to="/" replace />

  return <>{children}</>
}
