import { createViewModelStore } from '@/core/viewmodels'
import type { ViewModelStore } from '@/core/viewmodels'
import type { EventBus } from '@/core/event-bus'
import { getUserProfile, updateUserProfile } from '@/services/userService'
import type { ProfileWidgetState } from './ProfileWidget.types'

const initialState: ProfileWidgetState = {
  profile: null,
  displayName: '',
  editing: false,
  loading: false,
  error: null,
}

export interface ProfileWidgetVM extends ViewModelStore<ProfileWidgetState> {
  loadProfile: (uid: string) => Promise<void>
  startEdit: () => void
  cancelEdit: () => void
  setDisplayName: (displayName: string) => void
  saveProfile: (uid: string) => Promise<void>
}

export function createProfileWidgetViewModel(
  eventBus: EventBus
): ProfileWidgetVM {
  const store = createViewModelStore<ProfileWidgetState>(initialState)

  return {
    ...store,

    loadProfile: async (uid: string) => {
      store.setState({ loading: true, error: null })
      try {
        const profile = await getUserProfile(uid)
        store.setState({
          loading: false,
          profile,
          displayName: profile?.username ?? '',
        })
      } catch (err) {
        store.setState({
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load profile',
        })
      }
    },

    startEdit: () => {
      store.setState({ editing: true })
    },

    cancelEdit: () => {
      store.setState({
        editing: false,
        displayName: store.getState().profile?.username ?? '',
        error: null,
      })
    },

    setDisplayName: (displayName: string) => {
      store.setState({ displayName })
    },

    saveProfile: async (uid: string) => {
      store.setState({ loading: true, error: null })
      try {
        await updateUserProfile(uid, { username: store.getState().displayName })
        const currentState = store.getState()
        const updatedProfile = currentState.profile
          ? { ...currentState.profile, username: currentState.displayName }
          : null

        store.setState({
          loading: false,
          editing: false,
          profile: updatedProfile,
        })

        eventBus.emit('profile:updated', {
          displayName: store.getState().displayName,
          photoURL: store.getState().profile?.photoURL ?? null,
        })
      } catch (err) {
        store.setState({
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to save profile',
        })
      }
    },
  }
}
