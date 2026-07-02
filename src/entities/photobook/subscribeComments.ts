import {
  collection,
  onSnapshot,
  orderBy,
  query,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/shared/config/firebase/firebase'
import { createToken } from '@/shared/di'
import type { PhotoComment } from './types'

export const subscribeComments = (
  photoId: string,
  onChange: (comments: PhotoComment[]) => void
): Unsubscribe => {
  const commentsQuery = query(
    collection(db, 'photos', photoId, 'comments'),
    orderBy('createdAt', 'asc')
  )

  return onSnapshot(commentsQuery, (snapshot) => {
    const comments = snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate() ?? null,
      } as PhotoComment
    })
    onChange(comments)
  })
}

export const SubscribeCommentsToken =
  createToken<typeof subscribeComments>('SubscribeComments')
