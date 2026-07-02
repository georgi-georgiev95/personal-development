import {
  deleteDoc,
  doc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/shared/config/firebase/db'
import { createToken } from '@/shared/di'
import { ReactionServiceError } from './errors'

export const toggleReaction = async (
  photoId: string,
  commentId: string,
  uid: string,
  currentlyReacted: boolean
): Promise<void> => {
  const reactionRef = doc(
    db,
    'photos',
    photoId,
    'comments',
    commentId,
    'reactions',
    uid
  )
  const commentRef = doc(db, 'photos', photoId, 'comments', commentId)

  try {
    if (currentlyReacted) {
      await deleteDoc(reactionRef)
      await updateDoc(commentRef, { reactionCount: increment(-1) })
    } else {
      await setDoc(reactionRef, { uid, createdAt: serverTimestamp() })
      await updateDoc(commentRef, { reactionCount: increment(1) })
    }
  } catch (error) {
    console.error('Error toggling reaction:', error)
    throw new ReactionServiceError(
      'Failed to toggle reaction',
      'REACTION_TOGGLE_FAILED'
    )
  }
}

export const ToggleReactionToken =
  createToken<typeof toggleReaction>('ToggleReaction')
