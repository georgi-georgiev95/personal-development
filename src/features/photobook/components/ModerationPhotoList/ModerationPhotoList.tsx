import React, { useState } from 'react'
import { Button, ConfirmDialog, IconButton } from '@/shared/ui-kit'
import type { Photo } from '@/entities/photobook'
import {
  AuthorLine,
  Caption,
  EmptyState,
  Info,
  List,
  Row,
  RowActions,
  Thumbnail,
} from './ModerationPhotoList.styles'

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

interface ModerationPhotoListProps {
  photos: Photo[]
  selectedPhotoId: string | null
  onSelectPhoto: (photo: Photo) => void
  onDeletePhoto: (photo: Photo) => Promise<void>
}

export const ModerationPhotoList: React.FC<ModerationPhotoListProps> = ({
  photos,
  selectedPhotoId,
  onSelectPhoto,
  onDeletePhoto,
}) => {
  const [confirmingPhoto, setConfirmingPhoto] = useState<Photo | null>(null)

  if (photos.length === 0) {
    return <EmptyState>No photos to moderate yet.</EmptyState>
  }

  return (
    <List>
      {photos.map((photo) => (
        <Row key={photo.id}>
          <Thumbnail src={photo.imageURL} alt={photo.caption} />
          <Info>
            <Caption>{photo.caption || '(no caption)'}</Caption>
            <AuthorLine>
              {photo.authorName} · {photo.commentCount} comments
            </AuthorLine>
          </Info>
          <RowActions>
            <Button
              variant="secondary"
              onClick={() => onSelectPhoto(photo)}
              disabled={selectedPhotoId === photo.id}
            >
              Manage comments
            </Button>
            <IconButton
              variant="danger"
              aria-label="Delete photo"
              onClick={() => setConfirmingPhoto(photo)}
            >
              <TrashIcon />
            </IconButton>
          </RowActions>
        </Row>
      ))}
      <ConfirmDialog
        open={confirmingPhoto !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmingPhoto(null)
        }}
        title="Delete this photo?"
        message="This will permanently remove the photo and its comments."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (confirmingPhoto) void onDeletePhoto(confirmingPhoto)
        }}
      />
    </List>
  )
}
