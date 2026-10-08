import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => ({})) }))
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  connectAuthEmulator: vi.fn(),
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  connectFirestoreEmulator: vi.fn(),
}))

import { initializeApp } from 'firebase/app'
import { connectAuthEmulator } from 'firebase/auth'
import { connectFirestoreEmulator } from 'firebase/firestore'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
  vi.resetModules()
})

describe('Firebase emulator activation', () => {
  it.each([
    { dev: true, mode: 'emulator', enabled: true },
    { dev: true, mode: 'development', enabled: false },
    { dev: false, mode: 'emulator', enabled: false },
  ])(
    'requires development and explicit emulator mode: $dev/$mode',
    async ({ dev, mode, enabled }) => {
      vi.stubEnv('DEV', dev)
      vi.stubEnv('MODE', mode)
      vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'live-project')
      await import('@/shared/config/firebase/auth')
      await import('@/shared/config/firebase/db')
      expect(initializeApp).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: enabled ? 'demo-pd-28' : 'live-project',
        })
      )
      if (enabled) {
        expect(connectAuthEmulator).toHaveBeenCalledWith(
          expect.anything(),
          'http://127.0.0.1:9099'
        )
        expect(connectFirestoreEmulator).toHaveBeenCalledWith(
          expect.anything(),
          '127.0.0.1',
          8080
        )
      } else {
        expect(connectAuthEmulator).not.toHaveBeenCalled()
        expect(connectFirestoreEmulator).not.toHaveBeenCalled()
      }
    }
  )
})
