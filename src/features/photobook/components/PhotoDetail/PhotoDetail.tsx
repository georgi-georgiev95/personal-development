import React, { useEffect, useState } from 'react'
import { ConfirmDialog, IconButton, Modal } from '@/shared/ui-kit'
import type { Photo, PhotoComment } from '@/entities/photobook'
import {
  AddCommentToken,
  DeleteCommentToken,
  SubscribeCommentsToken,
} from '@/entities/photobook'
import { useInjectable } from '@/shared/di'
import { CommentForm } from '../CommentForm'
import { CommentListItem } from '../CommentListItem'
import {
  CommentsList,
  FullImage,
  SignInHint,
  Title,
} from './PhotoDetail.styles'

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
  </svg>
)

interface PhotoDetailProps {
  photo: Photo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserUid?: string
  currentUserName?: string
  onDeletePhoto?: (photo: Photo) => Promise<void>
}

export const PhotoDetail: React.FC<PhotoDetailProps> = ({
  photo,
  open,
  onOpenChange,
  currentUserUid,
  currentUserName,
  onDeletePhoto,
}) => {
  const subscribeComments = useInjectable(SubscribeCommentsToken)
  const addComment = useInjectable(AddCommentToken)
  const deleteComment = useInjectable(DeleteCommentToken)
  const [comments, setComments] = useState<PhotoComment[]>([])
  const [confirmingDeletePhoto, setConfirmingDeletePhoto] = useState(false)

  useEffect(() => {
    if (!photo) return undefined
    return subscribeComments(photo.id, setComments)
  }, [subscribeComments, photo])

  if (!photo) return null

  const canDeletePhoto =
    currentUserUid !== undefined &&
    photo.authorUid === currentUserUid &&
    onDeletePhoto !== undefined

  const handleAddComment = async (text: string) => {
    if (!currentUserUid || !currentUserName) return
    await addComment(photo.id, currentUserUid, currentUserName, text)
  }

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        label={photo.caption || photo.authorName}
      >
        <Modal.Header>
          <Title>{photo.caption || photo.authorName}</Title>
          {canDeletePhoto ? (
            <IconButton
              variant="danger"
              aria-label="Delete photo"
              onClick={() => setConfirmingDeletePhoto(true)}
            >
              <TrashIcon />
            </IconButton>
          ) : null}
        </Modal.Header>
        <Modal.Content>
          <FullImage
            src={photo.imageURL}
            alt={photo.caption || photo.authorName}
          />
          <CommentsList>
            {comments.map((comment) => (
              <CommentListItem
                key={comment.id}
                photoId={photo.id}
                comment={comment}
                currentUserUid={currentUserUid}
                onDelete={
                  currentUserUid && comment.authorUid === currentUserUid
                    ? () =>
                        deleteComment(photo.id, comment, currentUserUid, false)
                    : undefined
                }
              />
            ))}
          </CommentsList>
        </Modal.Content>
        <Modal.Footer>
          {currentUserUid && currentUserName ? (
            <CommentForm onSubmit={handleAddComment} />
          ) : (
            <SignInHint>Sign in to comment and react.</SignInHint>
          )}
        </Modal.Footer>
      </Modal>
      {canDeletePhoto ? (
        <ConfirmDialog
          open={confirmingDeletePhoto}
          onOpenChange={setConfirmingDeletePhoto}
          title="Delete this photo?"
          message="This will permanently remove the photo and its comments."
          confirmLabel="Delete"
          destructive
          onConfirm={() => void onDeletePhoto?.(photo)}
        />
      ) : null}
    </>
  )
}
