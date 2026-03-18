import { createContext } from 'react'

export interface ProfileContextType {
  photoURL: string | null
  updatePhotoURL: (url: string | null) => void
  refreshProfile: () => Promise<void>
}

export const ProfileContext = createContext<ProfileContextType>({
  photoURL: null,
  updatePhotoURL: () => {},
  refreshProfile: async () => {},
})

export default ProfileContext
