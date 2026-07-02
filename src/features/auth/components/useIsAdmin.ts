import { useEffect, useState } from 'react'
import { CheckIsAdminToken } from '@/entities/admin'
import { useInjectable } from '@/shared/di'
import { useAuth } from './useAuth'

export const useIsAdmin = (): boolean | null => {
  const { user } = useAuth()
  const checkIsAdmin = useInjectable(CheckIsAdminToken)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (!user) return
    checkIsAdmin(user.uid)
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false))
  }, [user, checkIsAdmin])

  return isAdmin
}
