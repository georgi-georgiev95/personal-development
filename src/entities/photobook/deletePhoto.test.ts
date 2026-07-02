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
  }
})

import { deletePhoto, DeletePhotoToken } from './deletePhoto'
import { PhotoServiceError } from './errors'
import { deleteDoc } from 'firebase/firestore'
import type { Photo } from './types'

const MockedDeleteDoc = vi.mocked(deleteDoc)

const photo: Photo = {
  id: 'photo-1',
  authorUid: 'uid-1',
  authorName: 'Alice',
  imageURL: 'data:image/jpeg;base64,abc123',
  caption: '',
  createdAt: null,
  commentCount: 0,
  reactionCount: 0,
}

describe('deletePhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws PhotoServiceError without deleting when the requester is neither owner nor admin', async () => {
    await expect(deletePhoto(photo, 'uid-2', false)).rejects.toThrow(
      PhotoServiceError
    )
    expect(MockedDeleteDoc).not.toHaveBeenCalled()
  })

  it('deletes the Firestore doc when the requester is the owner', async () => {
    MockedDeleteDoc.mockResolvedValue(undefined)

    await deletePhoto(photo, 'uid-1', false)

    expect(MockedDeleteDoc).toHaveBeenCalledWith({
      path: ['photos', 'photo-1'],
    })
  })

  it('deletes the Firestore doc when the requester is an admin but not the owner', async () => {
    MockedDeleteDoc.mockResolvedValue(undefined)

    await deletePhoto(photo, 'uid-2', true)

    expect(MockedDeleteDoc).toHaveBeenCalledTimes(1)
  })

  it('throws PhotoServiceError when deleteDoc fails', async () => {
    MockedDeleteDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(deletePhoto(photo, 'uid-1', false)).rejects.toThrow(
      PhotoServiceError
    )
  })
})

describe('DeletePhotoToken', () => {
  it('carries a description identifying the use case', () => {
    expect(DeletePhotoToken.description).toBe('DeletePhoto')
  })
})
