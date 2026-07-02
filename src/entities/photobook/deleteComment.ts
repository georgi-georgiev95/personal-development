import { deleteDoc, doc, increment, updateDoc } from 'firebase/firestore'
import { db } from '@/shared/config/firebase/db'
import { createToken } from '@/shared/di'
import { CommentServiceError } from './errors'
import type { PhotoComment } from './types'

export const deleteComment = async (
  photoId: string,
  comment: PhotoComment,
  requesterUid: string,
  isRequesterAdmin: boolean
): Promise<void> => {
  if (comment.authorUid !== requesterUid && !isRequesterAdmin) {
    throw new CommentServiceError(
      'Only the owner or an admin can delete this comment',
      'COMMENT_DELETE_FORBIDDEN'
    )
  }

  try {
    await deleteDoc(doc(db, 'photos', photoId, 'comments', comment.id))
    await updateDoc(doc(db, 'photos', photoId), {
      commentCount: increment(-1),
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    throw new CommentServiceError(
      'Failed to delete comment',
      'COMMENT_DELETE_FAILED'
    )
  }
}

export const DeleteCommentToken =
  createToken<typeof deleteComment>('DeleteComment')
