import React, { useEffect, useState } from 'react'
import { Avatar, ConfirmDialog, IconButton, Modal } from '@/shared/ui-kit'
import type { Photo, PhotoComment } from '@/entities/photobook'
import {
  AddCommentToken,
  DeleteCommentToken,
  SubscribeCommentsToken,
} from '@/entities/photobook'
import { useInjectable } from '@/shared/di'
import { CommentForm } from '../CommentForm'
import { CommentListItem } from '../CommentListItem'
import { usePhotoLike } from '../../hooks/usePhotoLike'
import {
  CommentsList,
  FullImage,
  LikeButton,
  SignInHint,
  Title,
  UploaderInfo,
  UploaderName,
  UploaderRow,
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

const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
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
  const {
    liked,
    pending: likePending,
    toggleLike,
  } = usePhotoLike(photo?.id ?? '', photo ? currentUserUid : undefined)

  useEffect(() => {
    if (!photo) return undefined
    return subscribeComments(photo.id, setComments)
  }, [subscribeComments, photo])

  if (!photo) return null

  const canDeletePhoto =
    currentUserUid !== undefined &&
    photo.authorUid === currentUserUid &&
    onDeletePhoto !== undefined
  const isOwner =
    currentUserUid !== undefined && photo.authorUid === currentUserUid

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
          <UploaderRow>
            <UploaderInfo>
              <Avatar name={photo.authorName} size="sm" />
              <UploaderName $isOwner={isOwner}>
                {isOwner ? 'You' : photo.authorName}
              </UploaderName>
            </UploaderInfo>
            {currentUserUid ? (
              <LikeButton
                type="button"
                $liked={liked}
                disabled={likePending}
                aria-label={liked ? 'Unlike photo' : 'Like photo'}
                onClick={toggleLike}
              >
                <HeartIcon filled={liked} />
                {photo.reactionCount ?? 0}
              </LikeButton>
            ) : null}
          </UploaderRow>
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
