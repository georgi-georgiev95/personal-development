import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ __type: 'app' })),
}))

vi.mock('firebase/firestore', () => {
  const db = { __type: 'db' }
  return {
    getFirestore: vi.fn(() => db),
    doc: vi.fn((_d: unknown, ...path: string[]) => ({ path })),
    onSnapshot: vi.fn(),
  }
})

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({ __type: 'storage' })),
}))

import { subscribeReaction, SubscribeReactionToken } from './subscribeReaction'
import { onSnapshot } from 'firebase/firestore'

const MockedOnSnapshot = vi.mocked(onSnapshot)

describe('subscribeReaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls onChange with true when the reaction doc exists', () => {
    const unsubscribe = vi.fn()
    MockedOnSnapshot.mockImplementation((_ref, callback) => {
      ;(callback as (snapshot: { exists: () => boolean }) => void)({
        exists: () => true,
      })
      return unsubscribe
    })

    const onChange = vi.fn()
    const result = subscribeReaction('photo-1', 'comment-1', 'uid-1', onChange)

    expect(onChange).toHaveBeenCalledWith(true)
    expect(result).toBe(unsubscribe)
  })

  it('calls onChange with false when the reaction doc does not exist', () => {
    MockedOnSnapshot.mockImplementation((_ref, callback) => {
      ;(callback as (snapshot: { exists: () => boolean }) => void)({
        exists: () => false,
      })
      return vi.fn()
    })

    const onChange = vi.fn()
    subscribeReaction('photo-1', 'comment-1', 'uid-1', onChange)

    expect(onChange).toHaveBeenCalledWith(false)
  })
})

describe('SubscribeReactionToken', () => {
  it('carries a description identifying the use case', () => {
    expect(SubscribeReactionToken.description).toBe('SubscribeReaction')
  })
})
