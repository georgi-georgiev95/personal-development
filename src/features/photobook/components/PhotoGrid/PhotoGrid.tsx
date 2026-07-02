import React from 'react'
import type { Photo } from '@/entities/photobook'
import { PhotoGridItem } from '../PhotoGridItem'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateSubtitle,
  EmptyStateTitle,
  Grid,
} from './PhotoGrid.styles'

const CameraIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
)

interface PhotoGridProps {
  photos: Photo[]
  onSelect: (photo: Photo) => void
  currentUserUid?: string
  onDeletePhoto?: (photo: Photo) => Promise<void>
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  onSelect,
  currentUserUid,
  onDeletePhoto,
}) => {
  if (photos.length === 0) {
    return (
      <EmptyState>
        <EmptyStateIcon>
          <CameraIcon />
        </EmptyStateIcon>
        <EmptyStateTitle>No photos yet</EmptyStateTitle>
        <EmptyStateSubtitle>
          Be the first to upload something.
        </EmptyStateSubtitle>
      </EmptyState>
    )
  }

  return (
    <Grid>
      {photos.map((photo) => (
        <PhotoGridItem
          key={photo.id}
          photo={photo}
          onSelect={() => onSelect(photo)}
          currentUserUid={currentUserUid}
          onDeletePhoto={onDeletePhoto}
        />
      ))}
    </Grid>
  )
}
