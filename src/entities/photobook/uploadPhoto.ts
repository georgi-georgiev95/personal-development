import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/shared/config/firebase/firebase'
import { createToken } from '@/shared/di'
import { compressImage } from './compressImage'
import { PhotoServiceError } from './errors'

// Firestore's per-document limit is 1 MiB; leave headroom for the other fields.
const MAX_IMAGE_DATA_URL_LENGTH = 900_000

export const uploadPhoto = async (
  uid: string,
  authorName: string,
  file: File,
  caption: string
): Promise<string> => {
  const imageURL = await compressImage(file)

  if (imageURL.length > MAX_IMAGE_DATA_URL_LENGTH) {
    throw new PhotoServiceError(
      'Photo is too large even after compression — try a smaller image',
      'PHOTO_TOO_LARGE'
    )
  }

  try {
    const photoDoc = await addDoc(collection(db, 'photos'), {
      authorUid: uid,
      authorName,
      imageURL,
      caption,
      createdAt: serverTimestamp(),
      commentCount: 0,
    })

    return photoDoc.id
  } catch (error) {
    console.error('Error uploading photo:', error)
    throw new PhotoServiceError('Failed to upload photo', 'PHOTO_UPLOAD_FAILED')
  }
}

export const UploadPhotoToken = createToken<typeof uploadPhoto>('UploadPhoto')
