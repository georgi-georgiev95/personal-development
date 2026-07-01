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

vi.mock('firebase/storage', () => {
  const storage = { __type: 'storage' }
  return {
    getStorage: vi.fn(() => storage),
    ref: vi.fn((_s: unknown, path: string) => ({ path })),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
  }
})

import { uploadPhoto, UploadPhotoToken } from './uploadPhoto'
import { PhotoServiceError } from './errors'
import { addDoc } from 'firebase/firestore'
import { getDownloadURL, uploadBytes } from 'firebase/storage'

const MockedAddDoc = vi.mocked(addDoc)
const MockedUploadBytes = vi.mocked(uploadBytes)
const MockedGetDownloadURL = vi.mocked(getDownloadURL)

const file = new File(['content'], 'sunset.jpg', { type: 'image/jpeg' })

describe('uploadPhoto', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uploads the file to storage and creates a Firestore doc', async () => {
    MockedUploadBytes.mockResolvedValue(undefined as never)
    MockedGetDownloadURL.mockResolvedValue('https://example.com/sunset.jpg')
    MockedAddDoc.mockResolvedValue({ id: 'photo-1' } as never)

    const id = await uploadPhoto('uid-1', 'Alice', file, 'A nice sunset')

    expect(id).toBe('photo-1')
    expect(MockedUploadBytes).toHaveBeenCalledTimes(1)
    expect(MockedAddDoc).toHaveBeenCalledWith(
      { path: ['photos'] },
      expect.objectContaining({
        authorUid: 'uid-1',
        authorName: 'Alice',
        imageURL: 'https://example.com/sunset.jpg',
        caption: 'A nice sunset',
        commentCount: 0,
      })
    )
  })

  it('defaults to a jpg extension when the file name has no extension', async () => {
    MockedUploadBytes.mockResolvedValue(undefined as never)
    MockedGetDownloadURL.mockResolvedValue('https://example.com/sunset')
    MockedAddDoc.mockResolvedValue({ id: 'photo-1' } as never)
    const fileWithoutExtension = new File(['content'], 'sunset', {
      type: 'image/jpeg',
    })

    await uploadPhoto('uid-1', 'Alice', fileWithoutExtension, 'A nice sunset')

    expect(MockedAddDoc).toHaveBeenCalledWith(
      { path: ['photos'] },
      expect.objectContaining({
        storagePath: expect.stringMatching(/\.jpg$/),
      })
    )
  })

  it('throws PhotoServiceError when uploadBytes fails', async () => {
    MockedUploadBytes.mockRejectedValue(new Error('Storage error'))

    await expect(
      uploadPhoto('uid-1', 'Alice', file, 'A nice sunset')
    ).rejects.toThrow(PhotoServiceError)
  })

  it('throws PhotoServiceError when getDownloadURL fails', async () => {
    MockedUploadBytes.mockResolvedValue(undefined as never)
    MockedGetDownloadURL.mockRejectedValue(new Error('Storage error'))

    await expect(
      uploadPhoto('uid-1', 'Alice', file, 'A nice sunset')
    ).rejects.toThrow(PhotoServiceError)
  })

  it('throws PhotoServiceError when addDoc fails', async () => {
    MockedUploadBytes.mockResolvedValue(undefined as never)
    MockedGetDownloadURL.mockResolvedValue('https://example.com/sunset.jpg')
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
