import { createContext } from 'react'
import type { User } from 'firebase/auth'

export interface AuthContextProps {
  user: User | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
})
