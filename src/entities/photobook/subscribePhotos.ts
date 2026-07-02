import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/shared/config/firebase/firebase'
import { createToken } from '@/shared/di'
import type { Photo } from './types'

const PHOTOS_PAGE_SIZE = 24

export const subscribePhotos = (
  onChange: (photos: Photo[]) => void
): Unsubscribe => {
  const photosQuery = query(
    collection(db, 'photos'),
    orderBy('createdAt', 'desc'),
    limit(PHOTOS_PAGE_SIZE)
  )

  return onSnapshot(photosQuery, (snapshot) => {
    const photos = snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate() ?? null,
      } as Photo
    })
    onChange(photos)
  })
}

export const SubscribePhotosToken =
  createToken<typeof subscribePhotos>('SubscribePhotos')
