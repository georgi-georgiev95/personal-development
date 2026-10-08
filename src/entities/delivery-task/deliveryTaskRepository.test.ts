import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createDeliveryTask, type DeliveryTask } from './deliveryTask'

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ __type: 'app' })),
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({ __type: 'db' })),
  collection: vi.fn((...segments: unknown[]) => segments),
  doc: vi.fn((...segments: unknown[]) => segments),
  getDocs: vi.fn(),
  orderBy: vi.fn((field: string, direction: string) => ({ field, direction })),
  query: vi.fn((reference: unknown, order: unknown) => ({ reference, order })),
  setDoc: vi.fn(),
}))

import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import {
  listWorkspaceDeliveryTasks,
  saveWorkspaceDeliveryTask,
} from './deliveryTaskRepository'

const mockedGetDocs = vi.mocked(getDocs)
const mockedSetDoc = vi.mocked(setDoc)

describe('delivery task repository', () => {
  beforeEach(() => vi.clearAllMocks())

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

  it('writes a task to its stable ID and strips undefined optional fields', async () => {
    const task = createDeliveryTask({ title: 'Task', goal: 'Goal' })
    task.validationChecks[0].evidence = undefined

    await saveWorkspaceDeliveryTask('owner-1', task)

    expect(doc).toHaveBeenCalledWith(
      { __type: 'db' },
      'workspaces',
      'owner-1',
      'tasks',
      task.id
    )
    expect(mockedSetDoc).toHaveBeenCalledWith(
      [{ __type: 'db' }, 'workspaces', 'owner-1', 'tasks', task.id],
      expect.any(Object)
    )
    const storedTask = mockedSetDoc.mock.calls[0][1] as DeliveryTask
    expect(storedTask.validationChecks[0]).not.toHaveProperty('evidence')
  })
})
