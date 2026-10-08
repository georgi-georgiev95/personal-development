import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
} from 'firebase/firestore'
import { db } from '@/shared/config/firebase/db'
import { DeliveryTaskConflictError } from './deliveryTask'
import type { DeliveryTask } from './deliveryTask'

export async function listWorkspaceDeliveryTasks(
  workspaceId: string
): Promise<DeliveryTask[]> {
  const tasks = await getDocs(
    query(
      collection(db, 'workspaces', workspaceId, 'tasks'),
      orderBy('createdAt', 'desc')
    )
  )
  return tasks.docs.map((task) => task.data() as DeliveryTask)
}

export async function saveWorkspaceDeliveryTask(
  workspaceId: string,
  task: DeliveryTask,
  operation: 'create' | 'update'
): Promise<DeliveryTask> {
  const reference = doc(db, 'workspaces', workspaceId, 'tasks', task.id)
  const expectedRevision = task.persistenceRevision ?? 0

  try {
    return await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(reference)

      if (operation === 'create' && snapshot.exists()) {
        const existing = snapshot.data() as DeliveryTask
        if (
          expectedRevision === 0 &&
          existing.id === task.id &&
          existing.title === task.title &&
          existing.goal === task.goal &&
          existing.createdAt === task.createdAt
        ) {
          return existing
        }
        throw new DeliveryTaskConflictError()
      }

      const actualRevision = snapshot.exists()
        ? ((snapshot.data() as DeliveryTask).persistenceRevision ?? 0)
        : 0
      if (
        (operation === 'create' && actualRevision !== 0) ||
        (operation === 'update' &&
          (!snapshot.exists() || actualRevision !== expectedRevision))
      ) {
        throw new DeliveryTaskConflictError()
      }

      const persisted = {
        ...task,
        persistenceRevision: actualRevision + 1,
      }
      // JSON round-tripping drops optional undefined fields from domain updates.
      transaction.set(
        reference,
        JSON.parse(JSON.stringify(persisted)) as DeliveryTask
      )
      return persisted
    })
  } catch (error) {
    try {
      const snapshot = await getDoc(reference)
      if (snapshot.exists()) {
        const existing = snapshot.data() as DeliveryTask
        if (
          operation === 'create' &&
          expectedRevision === 0 &&
          existing.id === task.id &&
          existing.title === task.title &&
          existing.goal === task.goal &&
          existing.createdAt === task.createdAt
        ) {
          return existing
        }
        if ((existing.persistenceRevision ?? 0) !== expectedRevision) {
          throw new DeliveryTaskConflictError()
        }
      }
    } catch (readError) {
      if (readError instanceof DeliveryTaskConflictError) throw readError
    }
    throw error
  }
}
