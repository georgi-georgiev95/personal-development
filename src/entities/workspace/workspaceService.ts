import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from '@/shared/config/firebase/db'

export async function ensurePersonalWorkspace(uid: string): Promise<void> {
  const workspaceRef = doc(db, 'workspaces', uid)

  await runTransaction(db, async (transaction) => {
    const workspace = await transaction.get(workspaceRef)

    if (!workspace.exists()) {
      transaction.set(workspaceRef, {
        ownerUid: uid,
        createdAt: serverTimestamp(),
      })
    }
  })
}
