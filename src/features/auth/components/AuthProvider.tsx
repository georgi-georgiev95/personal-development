import { useEffect, useState, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import { auth } from '@/shared/config/firebase/auth'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { AuthContext, type AuthContextValue } from './AuthContext'
import type { User } from 'firebase/auth'
import { useLocation } from 'react-router-dom'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { pathname } = useLocation()
  const lastUid = useRef<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (
        firebaseUser &&
        pathname !== '/demo' &&
        pathname !== '/engineering/ai-delivery' &&
        lastUid.current !== firebaseUser.uid
      ) {
        lastUid.current = firebaseUser.uid
        try {
          // Dynamic import keeps the Firestore SDK out of the entry chunk;
          // it only loads once a signed-in user actually exists.
          const { updateLastLogin } = await import('@/entities/user')
          await updateLastLogin(firebaseUser.uid)
        } catch (error) {
          console.error('Error updating last login:', error)
        }
      } else if (!firebaseUser) {
        lastUid.current = null
      }

      setLoading(false)
    })
    return () => unsubscribe()
  }, [pathname])

  const handleSignOut = useCallback(async () => {
    await firebaseSignOut(auth)
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    signOut: handleSignOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
