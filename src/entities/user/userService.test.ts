import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ __type: 'app' })),
}))

vi.mock('firebase/firestore', () => {
  const db = { __type: 'db' }
  return {
    getFirestore: vi.fn(() => db),
    doc: vi.fn((_d: unknown, collection: string, id: string) => ({
      collection,
      id,
    })),
    setDoc: vi.fn(),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
    serverTimestamp: () => ({ __type: 'serverTimestamp' }),
  }
})

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({ __type: 'storage' })),
}))

import { UserServiceError } from './userService'
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  updateLastLogin,
} from './userService'
import { setDoc, getDoc, updateDoc } from 'firebase/firestore'

const MockedSetDoc = vi.mocked(setDoc)
const MockedGetDoc = vi.mocked(getDoc)
const MockedUpdateDoc = vi.mocked(updateDoc)

describe('UserServiceError', () => {
  it('creates an error with message and code', () => {
    const error = new UserServiceError('Test error', 'TEST_CODE')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(UserServiceError)
    expect(error.message).toBe('Test error')
    expect(error.code).toBe('TEST_CODE')
    expect(error.name).toBe('UserServiceError')
  })
})

describe('createUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls setDoc with the user data', async () => {
    MockedSetDoc.mockResolvedValue(undefined)

    await createUserProfile(
      'uid-1',
      'test@example.com',
      'testuser',
      'John',
      'Doe',
      25
    )

    expect(MockedSetDoc).toHaveBeenCalledTimes(1)
    expect(MockedSetDoc).toHaveBeenCalledWith(
      { collection: 'users', id: 'uid-1' },
      expect.objectContaining({
        uid: 'uid-1',
        email: 'test@example.com',
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        photoURL: null,
        postCount: 0,
        commentCount: 0,
      })
    )
  })

  it('throws UserServiceError when setDoc fails', async () => {
    MockedSetDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(
      createUserProfile(
        'uid-1',
        'test@example.com',
        'testuser',
        'John',
        'Doe',
        25
      )
    ).rejects.toThrow(UserServiceError)
  })
})

describe('getUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when the document does not exist', async () => {
    MockedGetDoc.mockResolvedValue({ exists: () => false } as never)

    const result = await getUserProfile('uid-1')

    expect(result).toBeNull()
  })

  it('returns the user profile when the document exists', async () => {
    const now = new Date()
    MockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        uid: 'uid-1',
        email: 'test@example.com',
        username: 'testuser',
        photoURL: 'https://example.com/photo.jpg',
        createdAt: { toDate: () => now },
        lastLogin: { toDate: () => now },
        postCount: 5,
        commentCount: 3,
      }),
    } as never)

    const result = await getUserProfile('uid-1')

    expect(result).toEqual({
      uid: 'uid-1',
      email: 'test@example.com',
      username: 'testuser',
      photoURL: 'https://example.com/photo.jpg',
      createdAt: now,
      lastLogin: now,
      postCount: 5,
      commentCount: 3,
    })
  })

  it('returns null for timestamps when data has no timestamp fields', async () => {
    MockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        uid: 'uid-1',
        email: 'test@example.com',
        username: 'testuser',
        postCount: 0,
        commentCount: 0,
      }),
    } as never)

    const result = await getUserProfile('uid-1')

    expect(result).toEqual(
      expect.objectContaining({
        createdAt: null,
        lastLogin: null,
      })
    )
  })

  it('throws UserServiceError when getDoc fails', async () => {
    MockedGetDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(getUserProfile('uid-1')).rejects.toThrow(UserServiceError)
  })
})

describe('updateUserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls updateDoc with the provided data', async () => {
    MockedUpdateDoc.mockResolvedValue(undefined)

    await updateUserProfile('uid-1', { username: 'newname' })

    expect(MockedUpdateDoc).toHaveBeenCalledTimes(1)
    expect(MockedUpdateDoc).toHaveBeenCalledWith(
      { collection: 'users', id: 'uid-1' },
      { username: 'newname' }
    )
  })

  it('throws UserServiceError when updateDoc fails', async () => {
    MockedUpdateDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(
      updateUserProfile('uid-1', { username: 'newname' })
    ).rejects.toThrow(UserServiceError)
  })
})

describe('updateLastLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls updateDoc with serverTimestamp', async () => {
    MockedUpdateDoc.mockResolvedValue(undefined)

    await updateLastLogin('uid-1')

    expect(MockedUpdateDoc).toHaveBeenCalledTimes(1)
    expect(MockedUpdateDoc).toHaveBeenCalledWith(
      { collection: 'users', id: 'uid-1' },
      { lastLogin: { __type: 'serverTimestamp' } }
    )
  })

  it('throws UserServiceError when updateDoc fails', async () => {
    MockedUpdateDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(updateLastLogin('uid-1')).rejects.toThrow(UserServiceError)
  })
})
