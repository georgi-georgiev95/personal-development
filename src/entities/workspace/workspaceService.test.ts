import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ __type: 'app' })),
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ __type: 'db' })),
  doc: vi.fn((_db: unknown, collection: string, id: string) => ({
    collection,
    id,
  })),
  runTransaction: vi.fn(),
  serverTimestamp: vi.fn(() => ({ __type: 'serverTimestamp' })),
}))

import { runTransaction } from 'firebase/firestore'
import { ensurePersonalWorkspace } from './workspaceService'

const mockedRunTransaction = vi.mocked(runTransaction)

describe('ensurePersonalWorkspace', () => {
  beforeEach(() => vi.clearAllMocks())

  it('creates the UID-keyed workspace only when it does not exist', async () => {
    const transaction = {
      get: vi.fn().mockResolvedValue({ exists: () => false }),
      set: vi.fn(),
    }
    mockedRunTransaction.mockImplementation(async (_db, updateFunction) => {
      await updateFunction(transaction as never)
      return undefined as never
    })

    await ensurePersonalWorkspace('owner-1')

    expect(mockedRunTransaction).toHaveBeenCalledTimes(1)
    expect(transaction.get).toHaveBeenCalledWith({
      collection: 'workspaces',
      id: 'owner-1',
    })
    expect(transaction.set).toHaveBeenCalledWith(
      { collection: 'workspaces', id: 'owner-1' },
      {
        ownerUid: 'owner-1',
        createdAt: { __type: 'serverTimestamp' },
      }
    )
  })

  it('leaves an existing personal workspace unchanged', async () => {
    const transaction = {
      get: vi.fn().mockResolvedValue({ exists: () => true }),
      set: vi.fn(),
    }
    mockedRunTransaction.mockImplementation(async (_db, updateFunction) => {
      await updateFunction(transaction as never)
      return undefined as never
    })

    await ensurePersonalWorkspace('owner-1')

    expect(transaction.set).not.toHaveBeenCalled()
  })

  it('surfaces transaction failures to the caller', async () => {
    mockedRunTransaction.mockRejectedValue(new Error('Firestore unavailable'))

    await expect(ensurePersonalWorkspace('owner-1')).rejects.toThrow(
      'Firestore unavailable'
    )
  })
})
