import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/shared/config/firebase/db'
import { createToken } from '@/shared/di'
import { CommentServiceError } from './errors'

export const addComment = async (
  photoId: string,
  authorUid: string,
  authorName: string,
  text: string
): Promise<void> => {
  try {
    await addDoc(collection(db, 'photos', photoId, 'comments'), {
      photoId,
      authorUid,
      authorName,
      text,
      createdAt: serverTimestamp(),
      reactionCount: 0,
    })
    await updateDoc(doc(db, 'photos', photoId), {
      commentCount: increment(1),
    })
  } catch (error) {
    console.error('Error adding comment:', error)
    throw new CommentServiceError('Failed to add comment', 'COMMENT_ADD_FAILED')
  }
}

export const AddCommentToken = createToken<typeof addComment>('AddComment')
