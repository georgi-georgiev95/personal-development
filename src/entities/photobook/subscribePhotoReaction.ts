import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { db } from '@/shared/config/firebase/db'
import { createToken } from '@/shared/di'

export const subscribePhotoReaction = (
  photoId: string,
  uid: string,
  onChange: (reacted: boolean) => void
): Unsubscribe => {
  const reactionRef = doc(db, 'photos', photoId, 'reactions', uid)

  return onSnapshot(reactionRef, (snapshot) => {
    onChange(snapshot.exists())
  })
}

export const SubscribePhotoReactionToken = createToken<
  typeof subscribePhotoReaction
>('SubscribePhotoReaction')
