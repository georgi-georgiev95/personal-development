import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createDeliveryTask,
  DeliveryTaskConflictError,
  type DeliveryTask,
} from './deliveryTask'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ __type: 'app' })),
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ __type: 'db' })),
  collection: vi.fn((...segments: unknown[]) => segments),
  doc: vi.fn((...segments: unknown[]) => segments),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn((field: string, direction: string) => ({ field, direction })),
  query: vi.fn((reference: unknown, order: unknown) => ({ reference, order })),
  runTransaction: vi.fn(),
}))

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
} from 'firebase/firestore'
import {
  listWorkspaceDeliveryTasks,
  saveWorkspaceDeliveryTask,
} from './deliveryTaskRepository'

const mockedGetDocs = vi.mocked(getDocs)
const mockedGetDoc = vi.mocked(getDoc)
const mockedRunTransaction = vi.mocked(runTransaction)
const transactionGet = vi.fn()
const transactionSet = vi.fn()
const transaction = { get: transactionGet, set: transactionSet }

describe('delivery task repository', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockedRunTransaction.mockImplementation(((...args: unknown[]) =>
      (args[1] as (value: typeof transaction) => Promise<unknown>)(
        transaction
      )) as never)
  })

  it('lists only the selected workspace tasks, newest first', async () => {
    const task = createDeliveryTask({ title: 'Task', goal: 'Goal' })
    mockedGetDocs.mockResolvedValue({
      docs: [{ data: () => task }],
    } as never)

    await expect(listWorkspaceDeliveryTasks('owner-1')).resolves.toEqual([task])
    expect(collection).toHaveBeenCalledWith(
      { __type: 'db' },
      'workspaces',
      'owner-1',
      'tasks'
    )
    expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc')
    expect(query).toHaveBeenCalledTimes(1)
  })

  it('creates with a stable ID, initial revision, and no undefined fields', async () => {
    const task = createDeliveryTask({ title: 'Task', goal: 'Goal' })
    task.validationChecks[0].evidence = undefined
    transactionGet.mockResolvedValue({ exists: () => false })

    const saved = await saveWorkspaceDeliveryTask('owner-1', task, 'create')

    expect(doc).toHaveBeenCalledWith(
      { __type: 'db' },
      'workspaces',
      'owner-1',
      'tasks',
      task.id
    )
    expect(saved.persistenceRevision).toBe(1)
    expect(transactionSet).toHaveBeenCalledWith(
      expect.any(Array),
      expect.objectContaining({ persistenceRevision: 1 })
    )
    const storedTask = transactionSet.mock.calls[0][1] as DeliveryTask
    expect(storedTask.validationChecks[0]).not.toHaveProperty('evidence')
  })

  it('increments the revision atomically and rejects stale updates', async () => {
    const current = {
      ...createDeliveryTask({ title: 'Task', goal: 'Goal' }),
      persistenceRevision: 4,
    }
    transactionGet.mockResolvedValue({
      exists: () => true,
      data: () => current,
    })

    const saved = await saveWorkspaceDeliveryTask(
      'owner-1',
      { ...current, title: 'Updated task' },
      'update'
    )
    expect(saved.persistenceRevision).toBe(5)

    transactionGet.mockResolvedValue({
      exists: () => true,
      data: () => current,
    })
    await expect(
      saveWorkspaceDeliveryTask(
        'owner-1',
        { ...current, persistenceRevision: 3, title: 'Stale task' },
        'update'
      )
    ).rejects.toBeInstanceOf(DeliveryTaskConflictError)
  })

  it('rejects a create when the stable ID belongs to different task data', async () => {
    const task = createDeliveryTask({ title: 'Task', goal: 'Goal' })
    const existing = {
      ...task,
      title: 'Different task',
      persistenceRevision: 1,
    }
    transactionGet.mockResolvedValue({
      exists: () => true,
      data: () => existing,
    })
    mockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => existing,
    } as never)

    await expect(
      saveWorkspaceDeliveryTask('owner-1', task, 'create')
    ).rejects.toBeInstanceOf(DeliveryTaskConflictError)
  })

  it('returns a create retry found after an ambiguous transaction failure', async () => {
    const task = createDeliveryTask({ title: 'Task', goal: 'Goal' })
    const existing = { ...task, persistenceRevision: 1 }
    mockedRunTransaction.mockRejectedValueOnce(
      new Error('network interruption')
    )
    mockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => existing,
    } as never)

    await expect(
      saveWorkspaceDeliveryTask('owner-1', task, 'create')
    ).resolves.toEqual(existing)
  })

  it('preserves the original write error when rereading shows no newer revision', async () => {
    const task = {
      ...createDeliveryTask({ title: 'Task', goal: 'Goal' }),
      persistenceRevision: 1,
    }
    const writeError = new Error('permission-denied')
    mockedRunTransaction.mockRejectedValueOnce(writeError)
    mockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => task,
    } as never)

    await expect(
      saveWorkspaceDeliveryTask('owner-1', task, 'update')
    ).rejects.toBe(writeError)
  })

  it('preserves the write error when its diagnostic reread also fails', async () => {
    const task = createDeliveryTask({ title: 'Task', goal: 'Goal' })
    const writeError = new Error('write failed')
    mockedRunTransaction.mockRejectedValueOnce(writeError)
    mockedGetDoc.mockRejectedValueOnce(new Error('read failed'))

    await expect(
      saveWorkspaceDeliveryTask('owner-1', task, 'create')
    ).rejects.toBe(writeError)
  })

  it('starts a legacy task without a persistence revision at revision one', async () => {
    const task = createDeliveryTask({ title: 'Legacy task', goal: 'Goal' })
    transactionGet.mockResolvedValue({
      exists: () => true,
      data: () => task,
    })

    const saved = await saveWorkspaceDeliveryTask('owner-1', task, 'update')

    expect(saved.persistenceRevision).toBe(1)
  })

  it('turns a rejected write into a stale-task conflict when a newer revision exists', async () => {
    const task = createDeliveryTask({ title: 'Task', goal: 'Goal' })
    mockedRunTransaction.mockRejectedValueOnce(new Error('permission-denied'))
    mockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ ...task, persistenceRevision: 2 }),
    } as never)

    await expect(
      saveWorkspaceDeliveryTask(
        'owner-1',
        { ...task, persistenceRevision: 1, title: 'Stale task' },
        'update'
      )
    ).rejects.toBeInstanceOf(DeliveryTaskConflictError)
  })

  it('treats a legacy task as revision zero when diagnosing a rejected update', async () => {
    const task = {
      ...createDeliveryTask({ title: 'Task', goal: 'Goal' }),
      persistenceRevision: 1,
    }
    mockedRunTransaction.mockRejectedValueOnce(new Error('permission-denied'))
    mockedGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ ...task, persistenceRevision: undefined }),
    } as never)

    await expect(
      saveWorkspaceDeliveryTask('owner-1', task, 'update')
    ).rejects.toBeInstanceOf(DeliveryTaskConflictError)
  })

  it('returns an existing task when a create retry already committed', async () => {
    const task = {
      ...createDeliveryTask({ title: 'Task', goal: 'Goal' }),
      persistenceRevision: 1,
    }
    transactionGet.mockResolvedValue({ exists: () => true, data: () => task })

    await expect(
      saveWorkspaceDeliveryTask(
        'owner-1',
        { ...task, persistenceRevision: undefined },
        'create'
      )
    ).resolves.toEqual(task)
    expect(transactionSet).not.toHaveBeenCalled()
  })
})
