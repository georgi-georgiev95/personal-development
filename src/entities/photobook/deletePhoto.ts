import { deleteDoc, doc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { db, storage } from '@/shared/config/firebase/firebase'
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

  try {
    await deleteObject(ref(storage, photo.storagePath))
  } catch (error) {
    // Best-effort: the Firestore doc is the source of truth for the UI.
    // An admin deleting another user's photo will hit a Storage
    // permission error here (Storage rules only allow the owner to
    // delete their own path) — that's an accepted, harmless orphaned
    // blob rather than a reason to block moderation.
    console.error('Error deleting photo file from storage:', error)
  }
}

export const DeletePhotoToken = createToken<typeof deletePhoto>('DeletePhoto')
