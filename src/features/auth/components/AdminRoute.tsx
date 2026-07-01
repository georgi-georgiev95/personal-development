import type React from 'react'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { CheckIsAdminToken } from '@/entities/admin'
import { useInjectable } from '@/shared/di'
import { useAuth } from './useAuth'

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth()
  const checkIsAdmin = useInjectable(CheckIsAdminToken)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (!user) return
    checkIsAdmin(user.uid)
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false))
  }, [user, checkIsAdmin])

  if (loading) return null
  if (!user) return <Navigate to="/photobook" replace />
  if (isAdmin === null) return null
  if (!isAdmin) return <Navigate to="/photobook" replace />

  return <>{children}</>
}
