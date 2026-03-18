import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { getUserProfile, type UserProfile } from '../services/userService'
import { ProfileContext } from './ProfileContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/firebase'
export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth()
  const [photoURL, setPhotoURL] = useState<string | null>(null)

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profile = await getUserProfile(user.uid)
      setPhotoURL(profile?.photoURL || null)
    }
  }, [user])

  useEffect(() => {
    // If there's no user, ensure we clear any photoURL and skip listening
    if (!user) {
      // Avoid calling setState synchronously inside the effect body
      Promise.resolve().then(() => setPhotoURL(null))
      return
    }

    // Real-time listener on the user's profile document so all consumers
    // (NavBar, ProfilePage, etc.) update immediately when the document
    // changes (e.g. after uploading a new photo).
    const userRef = doc(db, 'users', user.uid)
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<UserProfile>
        setPhotoURL(data.photoURL || null)
      } else {
        Promise.resolve().then(() => setPhotoURL(null))
      }
    })

    // Also do an initial refresh to cover the case where onSnapshot
    // doesn't fire immediately in some environments.
    Promise.resolve().then(() => refreshProfile())

    return () => unsubscribe()
  }, [user, refreshProfile])

  const updatePhotoURL = (url: string | null) => {
    setPhotoURL(url)
  }

  return (
    <ProfileContext.Provider
      value={{ photoURL, updatePhotoURL, refreshProfile }}
    >
      {children}
    </ProfileContext.Provider>
  )
}
