import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createProfileWidgetViewModel } from './ProfileWidget.viewmodel'
import type { ProfileWidgetVM } from './ProfileWidget.viewmodel'
import type { EventBus } from '@/core/event-bus'
import * as userService from '@/services/userService'
import type { UserProfile } from '@/services/userService'

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/services/userService', () => ({
  getUserProfile: vi.fn(),
  updateUserProfile: vi.fn(),
}))

const mockEmit = vi.fn()
const mockEventBus: EventBus = {
  on: vi.fn(),
  off: vi.fn(),
  emit: mockEmit,
} as unknown as EventBus

const mockProfile: UserProfile = {
  uid: 'user-1',
  email: 'alice@example.com',
  username: 'Alice',
  photoURL: undefined,
  createdAt: null,
  lastLogin: null,
  postCount: 0,
  commentCount: 0,
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ProfileWidgetViewModel', () => {
  let vm: ProfileWidgetVM

  beforeEach(() => {
    vi.clearAllMocks()
    vm = createProfileWidgetViewModel(mockEventBus)
  })

  it('has correct initial state', () => {
    expect(vm.getState()).toStrictEqual({
      profile: null,
      displayName: '',
      editing: false,
      loading: false,
      error: null,
    })
  })

  describe('loadProfile', () => {
    it('sets profile and displayName on success', async () => {
      vi.mocked(userService.getUserProfile).mockResolvedValue(mockProfile)

      await vm.loadProfile('user-1')

      expect(vm.getState().profile).toStrictEqual(mockProfile)
      expect(vm.getState().displayName).toBe('Alice')
      expect(vm.getState().loading).toBe(false)
      expect(vm.getState().error).toBeNull()
    })

    it('sets error on failure', async () => {
      vi.mocked(userService.getUserProfile).mockRejectedValue(
        new Error('Firestore unavailable')
      )

      await vm.loadProfile('user-1')

      expect(vm.getState().error).toBe('Firestore unavailable')
      expect(vm.getState().loading).toBe(false)
      expect(vm.getState().profile).toBeNull()
    })
  })

  describe('edit lifecycle', () => {
    it('startEdit sets editing to true', () => {
      vm.startEdit()
      expect(vm.getState().editing).toBe(true)
    })

    it('cancelEdit resets editing and restores displayName', async () => {
      vi.mocked(userService.getUserProfile).mockResolvedValue(mockProfile)
      await vm.loadProfile('user-1')

      vm.startEdit()
      vm.setDisplayName('Changed Name')
      vm.cancelEdit()

      expect(vm.getState().editing).toBe(false)
      expect(vm.getState().displayName).toBe('Alice')
      expect(vm.getState().error).toBeNull()
    })
  })

  describe('saveProfile', () => {
    it('calls updateUserProfile and emits profile:updated', async () => {
      vi.mocked(userService.getUserProfile).mockResolvedValue(mockProfile)
      vi.mocked(userService.updateUserProfile).mockResolvedValue(undefined)
      await vm.loadProfile('user-1')

      vm.startEdit()
      vm.setDisplayName('New Name')
      await vm.saveProfile('user-1')

      expect(userService.updateUserProfile).toHaveBeenCalledWith('user-1', {
        username: 'New Name',
      })
      expect(mockEmit).toHaveBeenCalledWith('profile:updated', {
        displayName: 'New Name',
        photoURL: null,
      })
      expect(vm.getState().editing).toBe(false)
      expect(vm.getState().loading).toBe(false)
    })

    it('sets error state when save fails', async () => {
      vi.mocked(userService.getUserProfile).mockResolvedValue(mockProfile)
      vi.mocked(userService.updateUserProfile).mockRejectedValue(
        new Error('Write denied')
      )
      await vm.loadProfile('user-1')

      vm.startEdit()
      await vm.saveProfile('user-1')

      expect(vm.getState().error).toBe('Write denied')
      expect(vm.getState().loading).toBe(false)
    })
  })
})
