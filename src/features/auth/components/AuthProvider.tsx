import React, { useEffect, useState } from 'react'
import { auth } from '@/shared/config/firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { AuthContext } from './AuthContext'
import type { User } from 'firebase/auth'
import { updateLastLogin } from '@/shared/services/userService'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          await updateLastLogin(firebaseUser.uid)
        } catch (error) {
          console.error('Error updating last login:', error)
        }
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
