import React, { useEffect, useState } from 'react'
import { ConfirmDialog, IconButton } from '@/shared/ui-kit'
import type { PhotoComment } from '@/entities/photobook'
import {
  DeleteCommentToken,
  SubscribeCommentsToken,
} from '@/entities/photobook'
import { useInjectable } from '@/shared/di'
import {
  AuthorLine,
  CommentText,
  EmptyState,
  Info,
  List,
  Row,
} from './ModerationCommentList.styles'

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
  </svg>
)

interface ModerationCommentListProps {
  photoId: string
  requesterUid: string
}

export const ModerationCommentList: React.FC<ModerationCommentListProps> = ({
  photoId,
  requesterUid,
}) => {
  const subscribeComments = useInjectable(SubscribeCommentsToken)
  const deleteComment = useInjectable(DeleteCommentToken)
  const [comments, setComments] = useState<PhotoComment[]>([])
  const [confirmingComment, setConfirmingComment] =
    useState<PhotoComment | null>(null)

  useEffect(
    () => subscribeComments(photoId, setComments),
    [subscribeComments, photoId]
  )

  if (comments.length === 0) {
    return <EmptyState>No comments on this photo yet.</EmptyState>
  }

  return (
    <List>
      {comments.map((comment) => (
        <Row key={comment.id}>
          <Info>
            <AuthorLine>{comment.authorName}</AuthorLine>
            <CommentText>{comment.text}</CommentText>
          </Info>
          <IconButton
            variant="danger"
            aria-label="Delete comment"
            onClick={() => setConfirmingComment(comment)}
          >
            <TrashIcon />
          </IconButton>
        </Row>
      ))}
      <ConfirmDialog
        open={confirmingComment !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmingComment(null)
        }}
        title="Delete this comment?"
        message="This will permanently remove the comment."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (confirmingComment) {
            void deleteComment(photoId, confirmingComment, requesterUid, true)
          }
        }}
      />
    </List>
  )
}
