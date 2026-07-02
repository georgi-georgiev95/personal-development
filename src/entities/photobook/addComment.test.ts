import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ __type: 'app' })),
}))

vi.mock('firebase/firestore', () => {
  const db = { __type: 'db' }
  return {
    getFirestore: vi.fn(() => db),
    collection: vi.fn((_d: unknown, ...path: string[]) => ({ path })),
    doc: vi.fn((_d: unknown, ...path: string[]) => ({ path })),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    increment: vi.fn((n: number) => ({ __increment: n })),
    serverTimestamp: () => ({ __type: 'serverTimestamp' }),
  }
})

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({ __type: 'storage' })),
}))

import { addComment, AddCommentToken } from './addComment'
import { CommentServiceError } from './errors'
import { addDoc, updateDoc } from 'firebase/firestore'

const MockedAddDoc = vi.mocked(addDoc)
const MockedUpdateDoc = vi.mocked(updateDoc)

describe('addComment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('adds the comment doc and increments the photo commentCount', async () => {
    MockedAddDoc.mockResolvedValue({ id: 'comment-1' } as never)
    MockedUpdateDoc.mockResolvedValue(undefined)

    await addComment('photo-1', 'uid-1', 'Alice', 'Nice shot!')

    expect(MockedAddDoc).toHaveBeenCalledWith(
      { path: ['photos', 'photo-1', 'comments'] },
      expect.objectContaining({
        photoId: 'photo-1',
        authorUid: 'uid-1',
        authorName: 'Alice',
        text: 'Nice shot!',
        reactionCount: 0,
      })
    )
    expect(MockedUpdateDoc).toHaveBeenCalledWith(
      { path: ['photos', 'photo-1'] },
      { commentCount: { __increment: 1 } }
    )
  })

  it('throws CommentServiceError when addDoc fails', async () => {
    MockedAddDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(
      addComment('photo-1', 'uid-1', 'Alice', 'Nice shot!')
    ).rejects.toThrow(CommentServiceError)
  })

  it('throws CommentServiceError when updateDoc fails', async () => {
    MockedAddDoc.mockResolvedValue({ id: 'comment-1' } as never)
    MockedUpdateDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(
      addComment('photo-1', 'uid-1', 'Alice', 'Nice shot!')
    ).rejects.toThrow(CommentServiceError)
  })
})

describe('AddCommentToken', () => {
  it('carries a description identifying the use case', () => {
    expect(AddCommentToken.description).toBe('AddComment')
  })
})
