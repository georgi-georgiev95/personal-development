import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { getUserProfile } from '../services/userService'

interface ProfileContextType {
  photoURL: string | null
  updatePhotoURL: (url: string | null) => void
  refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType>({
  photoURL: null,
  updatePhotoURL: () => {},
  refreshProfile: async () => {},
})

export const useProfile = () => useContext(ProfileContext)

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth()
  const [photoURL, setPhotoURL] = useState<string | null>(null)

  const refreshProfile = async () => {
    if (user) {
      const profile = await getUserProfile(user.uid)
      setPhotoURL(profile?.photoURL || null)
    }
  }

  useEffect(() => {
    refreshProfile()
  }, [user])

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
