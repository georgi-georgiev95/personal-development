import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/shared/config/firebase/firebase'
import { createToken } from '@/shared/di'
import { AdminServiceError } from './errors'

export const checkIsAdmin = async (uid: string): Promise<boolean> => {
  try {
    const adminRef = doc(db, 'admins', uid)
    const adminSnap = await getDoc(adminRef)
    return adminSnap.exists()
  } catch (error) {
    console.error('Error checking admin status:', error)
    throw new AdminServiceError(
      'Failed to check admin status',
      'ADMIN_CHECK_FAILED'
    )
  }
}

export const CheckIsAdminToken =
  createToken<typeof checkIsAdmin>('CheckIsAdmin')
