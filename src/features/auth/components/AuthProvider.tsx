import React, { useEffect, useState, useCallback } from 'react'
import { auth } from '@/shared/config/firebase/auth'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { AuthContext, type AuthContextValue } from './AuthContext'
import type { User } from 'firebase/auth'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let lastUid: string | null = null

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser && lastUid !== firebaseUser.uid) {
        lastUid = firebaseUser.uid
        try {
          // Dynamic import keeps the Firestore SDK out of the entry chunk;
          // it only loads once a signed-in user actually exists.
          const { updateLastLogin } = await import('@/entities/user')
          await updateLastLogin(firebaseUser.uid)
        } catch (error) {
          console.error('Error updating last login:', error)
        }
      } else if (!firebaseUser) {
        lastUid = null
      }

      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

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
