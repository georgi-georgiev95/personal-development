import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ __type: 'app' })),
}))

vi.mock('firebase/firestore', () => {
  const db = { __type: 'db' }
  return {
    getFirestore: vi.fn(() => db),
    collection: vi.fn((_d: unknown, ...path: string[]) => ({ path })),
    addDoc: vi.fn(),
    serverTimestamp: () => ({ __type: 'serverTimestamp' }),
  }
})

vi.mock('./compressImage', () => ({
  compressImage: vi.fn(),
}))

import { uploadPhoto, UploadPhotoToken } from './uploadPhoto'
import { PhotoServiceError } from './errors'
import { addDoc } from 'firebase/firestore'
import { compressImage } from './compressImage'

const MockedAddDoc = vi.mocked(addDoc)
const MockedCompressImage = vi.mocked(compressImage)

const file = new File(['content'], 'sunset.jpg', { type: 'image/jpeg' })

describe('uploadPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('compresses the file and creates a Firestore doc with the resulting data URL', async () => {
    MockedCompressImage.mockResolvedValue('data:image/jpeg;base64,abc123')
    MockedAddDoc.mockResolvedValue({ id: 'photo-1' } as never)

    const id = await uploadPhoto('uid-1', 'Alice', file, 'A nice sunset')

    expect(id).toBe('photo-1')
    expect(MockedCompressImage).toHaveBeenCalledWith(file)
    expect(MockedAddDoc).toHaveBeenCalledWith(
      { path: ['photos'] },
      expect.objectContaining({
        authorUid: 'uid-1',
        authorName: 'Alice',
        imageURL: 'data:image/jpeg;base64,abc123',
        caption: 'A nice sunset',
        commentCount: 0,
        reactionCount: 0,
      })
    )
  })

  it('throws PhotoServiceError when the compressed image still exceeds the size cap', async () => {
    MockedCompressImage.mockResolvedValue(
      `data:image/jpeg;base64,${'a'.repeat(900_001)}`
    )

    await expect(
      uploadPhoto('uid-1', 'Alice', file, 'A nice sunset')
    ).rejects.toThrow(PhotoServiceError)
    expect(MockedAddDoc).not.toHaveBeenCalled()
  })

  it('throws PhotoServiceError when compressImage fails', async () => {
    MockedCompressImage.mockRejectedValue(new Error('Canvas error'))

    await expect(
      uploadPhoto('uid-1', 'Alice', file, 'A nice sunset')
    ).rejects.toThrow('Canvas error')
  })

  it('throws PhotoServiceError when addDoc fails', async () => {
    MockedCompressImage.mockResolvedValue('data:image/jpeg;base64,abc123')
    MockedAddDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(
      uploadPhoto('uid-1', 'Alice', file, 'A nice sunset')
    ).rejects.toThrow(PhotoServiceError)
  })
})

describe('UploadPhotoToken', () => {
  it('carries a description identifying the use case', () => {
    expect(UploadPhotoToken.description).toBe('UploadPhoto')
  })
})
