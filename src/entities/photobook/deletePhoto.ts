import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/shared/config/firebase/firebase'
import { createToken } from '@/shared/di'
import { PhotoServiceError } from './errors'
import type { Photo } from './types'

export const deletePhoto = async (
  photo: Photo,
  requesterUid: string,
  isRequesterAdmin: boolean
): Promise<void> => {
  if (photo.authorUid !== requesterUid && !isRequesterAdmin) {
    throw new PhotoServiceError(
      'Only the owner or an admin can delete this photo',
      'PHOTO_DELETE_FORBIDDEN'
    )
  }

  try {
    await deleteDoc(doc(db, 'photos', photo.id))
  } catch (error) {
    console.error('Error deleting photo:', error)
    throw new PhotoServiceError('Failed to delete photo', 'PHOTO_DELETE_FAILED')
  }
}

export const DeletePhotoToken = createToken<typeof deletePhoto>('DeletePhoto')
