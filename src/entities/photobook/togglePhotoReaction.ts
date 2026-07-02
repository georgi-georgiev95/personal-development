import {
  deleteDoc,
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/shared/config/firebase/firebase'
import { createToken } from '@/shared/di'
import { ReactionServiceError } from './errors'

export const togglePhotoReaction = async (
  photoId: string,
  uid: string,
  currentlyReacted: boolean
): Promise<void> => {
  const reactionRef = doc(db, 'photos', photoId, 'reactions', uid)
  const photoRef = doc(db, 'photos', photoId)

  try {
    if (currentlyReacted) {
      await deleteDoc(reactionRef)
      await updateDoc(photoRef, { reactionCount: increment(-1) })
    } else {
      await setDoc(reactionRef, { uid, createdAt: serverTimestamp() })
      await updateDoc(photoRef, { reactionCount: increment(1) })
    }
  } catch (error) {
    console.error('Error toggling reaction:', error)
    throw new ReactionServiceError(
      'Failed to toggle reaction',
      'REACTION_TOGGLE_FAILED'
    )
  }
}

export const TogglePhotoReactionToken = createToken<typeof togglePhotoReaction>(
  'TogglePhotoReaction'
)
