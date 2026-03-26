import type { UserProfile } from '@/services/userService'

export interface ProfileWidgetProps {
  /** Optional override for initial uid. Defaults to currently authenticated user. */
  uid?: string
}

export interface ProfileWidgetState {
  profile: UserProfile | null
  displayName: string
  editing: boolean
  loading: boolean
  error: string | null
}
