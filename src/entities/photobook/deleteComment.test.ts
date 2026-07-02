import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ __type: 'app' })),
}))

vi.mock('firebase/firestore', () => {
  const db = { __type: 'db' }
  return {
    getFirestore: vi.fn(() => db),
    doc: vi.fn((_d: unknown, ...path: string[]) => ({ path })),
    deleteDoc: vi.fn(),
    updateDoc: vi.fn(),
    increment: vi.fn((n: number) => ({ __increment: n })),
  }
})

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({ __type: 'storage' })),
}))

import { deleteComment, DeleteCommentToken } from './deleteComment'
import { CommentServiceError } from './errors'
import { deleteDoc, updateDoc } from 'firebase/firestore'
import type { PhotoComment } from './types'

const MockedDeleteDoc = vi.mocked(deleteDoc)
const MockedUpdateDoc = vi.mocked(updateDoc)

const comment: PhotoComment = {
  id: 'comment-1',
  photoId: 'photo-1',
  authorUid: 'uid-1',
  authorName: 'Alice',
  text: 'Nice shot!',
  createdAt: null,
  reactionCount: 0,
}

describe('deleteComment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws CommentServiceError without deleting when the requester is neither owner nor admin', async () => {
    await expect(
      deleteComment('photo-1', comment, 'uid-2', false)
    ).rejects.toThrow(CommentServiceError)
    expect(MockedDeleteDoc).not.toHaveBeenCalled()
  })

  it('deletes the comment and decrements commentCount when the requester is the owner', async () => {
    MockedDeleteDoc.mockResolvedValue(undefined)
    MockedUpdateDoc.mockResolvedValue(undefined)

    await deleteComment('photo-1', comment, 'uid-1', false)

    expect(MockedDeleteDoc).toHaveBeenCalledWith({
      path: ['photos', 'photo-1', 'comments', 'comment-1'],
    })
    expect(MockedUpdateDoc).toHaveBeenCalledWith(
      { path: ['photos', 'photo-1'] },
      { commentCount: { __increment: -1 } }
    )
  })

  it('deletes the comment when the requester is an admin but not the owner', async () => {
    MockedDeleteDoc.mockResolvedValue(undefined)
    MockedUpdateDoc.mockResolvedValue(undefined)

    await deleteComment('photo-1', comment, 'uid-2', true)

    expect(MockedDeleteDoc).toHaveBeenCalledTimes(1)
  })

  it('throws CommentServiceError when deleteDoc fails', async () => {
    MockedDeleteDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(
      deleteComment('photo-1', comment, 'uid-1', false)
    ).rejects.toThrow(CommentServiceError)
  })

  it('throws CommentServiceError when updateDoc fails', async () => {
    MockedDeleteDoc.mockResolvedValue(undefined)
    MockedUpdateDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(
      deleteComment('photo-1', comment, 'uid-1', false)
    ).rejects.toThrow(CommentServiceError)
  })
})

describe('DeleteCommentToken', () => {
  it('carries a description identifying the use case', () => {
    expect(DeleteCommentToken.description).toBe('DeleteComment')
  })
})
