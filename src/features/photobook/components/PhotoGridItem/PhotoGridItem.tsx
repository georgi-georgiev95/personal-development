import React, { useState } from 'react'
import { ConfirmDialog } from '@/shared/ui-kit'
import type { Photo } from '@/entities/photobook'
import {
  AuthorName,
  Card,
  CardButton,
  Caption,
  CountItem,
  CountsGroup,
  DeleteButton,
  Meta,
  MetaRow,
  Thumbnail,
} from './PhotoGridItem.styles'

const HeartIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
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

interface PhotoGridItemProps {
  photo: Photo
  onSelect: () => void
  currentUserUid?: string
  onDeletePhoto?: (photo: Photo) => Promise<void>
}

export const PhotoGridItem: React.FC<PhotoGridItemProps> = ({
  photo,
  onSelect,
  currentUserUid,
  onDeletePhoto,
}) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const isOwner =
    currentUserUid !== undefined && photo.authorUid === currentUserUid
  const canDelete = isOwner && onDeletePhoto !== undefined

  return (
    <Card>
      {canDelete ? (
        <DeleteButton
          type="button"
          aria-label="Delete photo"
          onClick={() => setConfirmingDelete(true)}
        >
          <TrashIcon />
        </DeleteButton>
      ) : null}
      <CardButton type="button" onClick={onSelect}>
        <Thumbnail
          src={photo.imageURL}
          alt={photo.caption || photo.authorName}
        />
        <Meta>
          <Caption>{photo.caption || photo.authorName}</Caption>
          <MetaRow>
            <AuthorName $isOwner={isOwner}>
              {isOwner ? 'You' : photo.authorName}
            </AuthorName>
            <CountsGroup>
              <CountItem>
                <HeartIcon />
                {photo.reactionCount ?? 0}
              </CountItem>
              <CountItem>{photo.commentCount} comments</CountItem>
            </CountsGroup>
          </MetaRow>
        </Meta>
      </CardButton>
      {canDelete ? (
        <ConfirmDialog
          open={confirmingDelete}
          onOpenChange={setConfirmingDelete}
          title="Delete this photo?"
          message="This will permanently remove the photo and its comments."
          confirmLabel="Delete"
          destructive
          onConfirm={() => void onDeletePhoto?.(photo)}
        />
      ) : null}
    </Card>
  )
}
