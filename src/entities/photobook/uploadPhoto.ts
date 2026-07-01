import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '@/shared/config/firebase/firebase'
import { createToken } from '@/shared/di'
import { PhotoServiceError } from './errors'

export const uploadPhoto = async (
  uid: string,
  authorName: string,
  file: File,
  caption: string
): Promise<string> => {
  try {
    const extension = file.name.includes('.')
      ? file.name.split('.').pop()!
      : 'jpg'
    const storagePath = `photobook/${uid}/${crypto.randomUUID()}.${extension}`
    const fileRef = ref(storage, storagePath)
    await uploadBytes(fileRef, file)
    const imageURL = await getDownloadURL(fileRef)

    const photoDoc = await addDoc(collection(db, 'photos'), {
      authorUid: uid,
      authorName,
      storagePath,
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
