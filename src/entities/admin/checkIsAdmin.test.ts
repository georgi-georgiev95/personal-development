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
    getDoc: vi.fn(),
  }
})

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({ __type: 'storage' })),
}))

import { checkIsAdmin, CheckIsAdminToken } from './checkIsAdmin'
import { AdminServiceError } from './errors'
import { getDoc } from 'firebase/firestore'

const MockedGetDoc = vi.mocked(getDoc)

describe('checkIsAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true when the admin document exists', async () => {
    MockedGetDoc.mockResolvedValue({ exists: () => true } as never)

    const result = await checkIsAdmin('uid-1')

    expect(result).toBe(true)
  })

  it('returns false when the admin document does not exist', async () => {
    MockedGetDoc.mockResolvedValue({ exists: () => false } as never)

    const result = await checkIsAdmin('uid-1')

    expect(result).toBe(false)
  })

  it('throws AdminServiceError when getDoc fails', async () => {
    MockedGetDoc.mockRejectedValue(new Error('Firestore error'))

    await expect(checkIsAdmin('uid-1')).rejects.toThrow(AdminServiceError)
  })
})

describe('CheckIsAdminToken', () => {
  it('carries a description identifying the use case', () => {
    expect(CheckIsAdminToken.description).toBe('CheckIsAdmin')
  })
})
