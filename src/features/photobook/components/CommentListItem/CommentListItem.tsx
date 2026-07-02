import React, { useEffect, useState } from 'react'
import { Avatar, ConfirmDialog, IconButton } from '@/shared/ui-kit'
import type { PhotoComment } from '@/entities/photobook'
import {
  SubscribeReactionToken,
  ToggleReactionToken,
} from '@/entities/photobook'
import { useInjectable } from '@/shared/di'
import {
  Actions,
  AuthorName,
  Bubble,
  CommentText,
  Header,
  ReactionCount,
  Row,
} from './CommentListItem.styles'

const HeartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

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

interface CommentListItemProps {
  photoId: string
  comment: PhotoComment
  currentUserUid?: string
  onDelete?: () => Promise<void>
}

export const CommentListItem: React.FC<CommentListItemProps> = ({
  photoId,
  comment,
  currentUserUid,
  onDelete,
}) => {
  const subscribeReaction = useInjectable(SubscribeReactionToken)
  const toggleReaction = useInjectable(ToggleReactionToken)
  const [reacted, setReacted] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    if (!currentUserUid) return undefined
    return subscribeReaction(photoId, comment.id, currentUserUid, setReacted)
  }, [subscribeReaction, photoId, comment.id, currentUserUid])

  const canDelete = currentUserUid !== undefined && onDelete !== undefined
  const isOwner =
    currentUserUid !== undefined && comment.authorUid === currentUserUid

  return (
    <Row>
      <Avatar name={comment.authorName} size="sm" />
      <Bubble>
        <Header>
          <AuthorName $isOwner={isOwner}>
            {isOwner ? 'You' : comment.authorName}
          </AuthorName>
          <Actions>
            {currentUserUid ? (
              <IconButton
                aria-label={reacted ? 'Unlike comment' : 'Like comment'}
                active={reacted}
                onClick={() =>
                  toggleReaction(photoId, comment.id, currentUserUid, reacted)
                }
              >
                <HeartIcon />
              </IconButton>
            ) : null}
            <ReactionCount>{comment.reactionCount}</ReactionCount>
            {canDelete ? (
              <IconButton
                variant="danger"
                aria-label="Delete comment"
                onClick={() => setConfirmingDelete(true)}
              >
                <TrashIcon />
              </IconButton>
            ) : null}
          </Actions>
        </Header>
        <CommentText>{comment.text}</CommentText>
      </Bubble>
      {canDelete ? (
        <ConfirmDialog
          open={confirmingDelete}
          onOpenChange={setConfirmingDelete}
          title="Delete this comment?"
          message="This will permanently remove the comment."
          confirmLabel="Delete"
          destructive
          onConfirm={() => void onDelete?.()}
        />
      ) : null}
    </Row>
  )
}
