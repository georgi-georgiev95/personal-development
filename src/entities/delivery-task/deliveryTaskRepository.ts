import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore'
import { db } from '@/shared/config/firebase/db'
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
  task: DeliveryTask
): Promise<void> {
  const reference = doc(db, 'workspaces', workspaceId, 'tasks', task.id)
  // JSON round-tripping drops optional undefined fields from domain updates.
  await setDoc(reference, JSON.parse(JSON.stringify(task)) as DeliveryTask)
}
