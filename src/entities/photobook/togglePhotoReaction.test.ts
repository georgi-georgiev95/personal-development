import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ __type: 'app' })),
}))

vi.mock('firebase/firestore', () => {
  const db = { __type: 'db' }
  return {
    getFirestore: vi.fn(() => db),
    doc: vi.fn((_d: unknown, ...path: string[]) => ({ path })),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
    updateDoc: vi.fn(),
    increment: vi.fn((n: number) => ({ __increment: n })),
    serverTimestamp: () => ({ __type: 'serverTimestamp' }),
  }
})

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({ __type: 'storage' })),
}))

import {
  togglePhotoReaction,
  TogglePhotoReactionToken,
} from './togglePhotoReaction'
import { ReactionServiceError } from './errors'
import { deleteDoc, setDoc, updateDoc } from 'firebase/firestore'

const MockedSetDoc = vi.mocked(setDoc)
const MockedDeleteDoc = vi.mocked(deleteDoc)
const MockedUpdateDoc = vi.mocked(updateDoc)

describe('togglePhotoReaction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates the reaction doc and increments reactionCount when not currently reacted', async () => {
    MockedSetDoc.mockResolvedValue(undefined)
    MockedUpdateDoc.mockResolvedValue(undefined)

    await togglePhotoReaction('photo-1', 'uid-1', false)

    expect(MockedSetDoc).toHaveBeenCalledWith(
      { path: ['photos', 'photo-1', 'reactions', 'uid-1'] },
      expect.objectContaining({ uid: 'uid-1' })
    )
    expect(MockedUpdateDoc).toHaveBeenCalledWith(
      { path: ['photos', 'photo-1'] },
      { reactionCount: { __increment: 1 } }
    )
    expect(MockedDeleteDoc).not.toHaveBeenCalled()
  })

  it('deletes the reaction doc and decrements reactionCount when currently reacted', async () => {
    MockedDeleteDoc.mockResolvedValue(undefined)
    MockedUpdateDoc.mockResolvedValue(undefined)

    await togglePhotoReaction('photo-1', 'uid-1', true)

    expect(MockedDeleteDoc).toHaveBeenCalledWith({
      path: ['photos', 'photo-1', 'reactions', 'uid-1'],
    })
    expect(MockedUpdateDoc).toHaveBeenCalledWith(
      { path: ['photos', 'photo-1'] },
      { reactionCount: { __increment: -1 } }
    )
    expect(MockedSetDoc).not.toHaveBeenCalled()
  })

  it('throws ReactionServiceError when setDoc fails', async () => {
    MockedSetDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(
      togglePhotoReaction('photo-1', 'uid-1', false)
    ).rejects.toThrow(ReactionServiceError)
  })

  it('throws ReactionServiceError when deleteDoc fails', async () => {
    MockedDeleteDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(togglePhotoReaction('photo-1', 'uid-1', true)).rejects.toThrow(
      ReactionServiceError
    )
  })

  it('throws ReactionServiceError when updateDoc fails', async () => {
    MockedSetDoc.mockResolvedValue(undefined)
    MockedUpdateDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(
      togglePhotoReaction('photo-1', 'uid-1', false)
    ).rejects.toThrow(ReactionServiceError)
  })
})

describe('TogglePhotoReactionToken', () => {
  it('carries a description identifying the use case', () => {
    expect(TogglePhotoReactionToken.description).toBe('TogglePhotoReaction')
  })
})
