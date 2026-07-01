import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ __type: 'app' })),
}))

vi.mock('firebase/firestore', () => {
  const db = { __type: 'db' }
  return {
    getFirestore: vi.fn(() => db),
    collection: vi.fn((_d: unknown, ...path: string[]) => ({ path })),
    query: vi.fn((collectionRef: unknown, ...clauses: unknown[]) => ({
      collectionRef,
      clauses,
    })),
    orderBy: vi.fn((field: string, direction: string) => ({
      field,
      direction,
    })),
    onSnapshot: vi.fn(),
  }
})

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({ __type: 'storage' })),
}))

import { subscribeComments, SubscribeCommentsToken } from './subscribeComments'
import { onSnapshot } from 'firebase/firestore'

const MockedOnSnapshot = vi.mocked(onSnapshot)

describe('subscribeComments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps snapshot docs into PhotoComment objects ordered by createdAt asc', () => {
    const now = new Date()
    const unsubscribe = vi.fn()
    MockedOnSnapshot.mockImplementation((_query, callback) => {
      ;(
        callback as (snapshot: {
          docs: { id: string; data: () => unknown }[]
        }) => void
      )({
        docs: [
          {
            id: 'comment-1',
            data: () => ({
              photoId: 'photo-1',
              authorUid: 'uid-1',
              authorName: 'Alice',
              text: 'Nice shot!',
              createdAt: { toDate: () => now },
              reactionCount: 3,
            }),
          },
        ],
      })
      return unsubscribe
    })

    const onChange = vi.fn()
    const result = subscribeComments('photo-1', onChange)

    expect(onChange).toHaveBeenCalledWith([
      {
        id: 'comment-1',
        photoId: 'photo-1',
        authorUid: 'uid-1',
        authorName: 'Alice',
        text: 'Nice shot!',
        createdAt: now,
        reactionCount: 3,
      },
    ])
    expect(result).toBe(unsubscribe)
  })

  it('defaults createdAt to null when missing from the document data', () => {
    const unsubscribe = vi.fn()
    MockedOnSnapshot.mockImplementation((_query, callback) => {
      ;(
        callback as (snapshot: {
          docs: { id: string; data: () => unknown }[]
        }) => void
      )({
        docs: [
          {
            id: 'comment-1',
            data: () => ({
              photoId: 'photo-1',
              authorUid: 'uid-1',
              authorName: 'Alice',
              text: 'Nice shot!',
              reactionCount: 0,
            }),
          },
        ],
      })
      return unsubscribe
    })

    const onChange = vi.fn()
    subscribeComments('photo-1', onChange)

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ createdAt: null }),
    ])
  })
})

describe('SubscribeCommentsToken', () => {
  it('carries a description identifying the use case', () => {
    expect(SubscribeCommentsToken.description).toBe('SubscribeComments')
  })
})
