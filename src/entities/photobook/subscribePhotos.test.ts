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

import { subscribePhotos, SubscribePhotosToken } from './subscribePhotos'
import { onSnapshot } from 'firebase/firestore'

const MockedOnSnapshot = vi.mocked(onSnapshot)

describe('subscribePhotos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('maps snapshot docs into Photo objects ordered by createdAt desc', () => {
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
            id: 'photo-1',
            data: () => ({
              authorUid: 'uid-1',
              authorName: 'Alice',
              storagePath: 'photobook/uid-1/a.jpg',
              imageURL: 'https://example.com/a.jpg',
              caption: 'Hi',
              createdAt: { toDate: () => now },
              commentCount: 2,
            }),
          },
        ],
      })
      return unsubscribe
    })

    const onChange = vi.fn()
    const result = subscribePhotos(onChange)

    expect(onChange).toHaveBeenCalledWith([
      {
        id: 'photo-1',
        authorUid: 'uid-1',
        authorName: 'Alice',
        storagePath: 'photobook/uid-1/a.jpg',
        imageURL: 'https://example.com/a.jpg',
        caption: 'Hi',
        createdAt: now,
        commentCount: 2,
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
            id: 'photo-1',
            data: () => ({
              authorUid: 'uid-1',
              authorName: 'Alice',
              storagePath: 'photobook/uid-1/a.jpg',
              imageURL: 'https://example.com/a.jpg',
              caption: 'Hi',
              commentCount: 0,
            }),
          },
        ],
      })
      return unsubscribe
    })

    const onChange = vi.fn()
    subscribePhotos(onChange)

    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ createdAt: null }),
    ])
  })
})

describe('SubscribePhotosToken', () => {
  it('carries a description identifying the use case', () => {
    expect(SubscribePhotosToken.description).toBe('SubscribePhotos')
  })
})
