import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { db } from '@/shared/config/firebase/firebase'
import { createToken } from '@/shared/di'

export const subscribeReaction = (
  photoId: string,
  commentId: string,
  uid: string,
  onChange: (reacted: boolean) => void
): Unsubscribe => {
  const reactionRef = doc(
    db,
    'photos',
    photoId,
    'comments',
    commentId,
    'reactions',
    uid
  )

  return onSnapshot(reactionRef, (snapshot) => {
    onChange(snapshot.exists())
  })
}

export const SubscribeReactionToken =
  createToken<typeof subscribeReaction>('SubscribeReaction')
