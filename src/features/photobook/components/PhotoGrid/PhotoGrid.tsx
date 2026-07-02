import React from 'react'
import type { Photo } from '@/entities/photobook'
import { Skeleton } from '@/shared/ui-kit'
import { PhotoGridItem } from '../PhotoGridItem'
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateSubtitle,
  EmptyStateTitle,
  Grid,
  SkeletonCard,
  SkeletonMeta,
  SkeletonMetaRow,
  SkeletonThumbnailWrapper,
} from './PhotoGrid.styles'

const SKELETON_COUNT = 4

const PhotoGridSkeletonItem: React.FC = () => (
  <SkeletonCard>
    <SkeletonThumbnailWrapper>
      <Skeleton variant="rect" width="100%" height="100%" />
    </SkeletonThumbnailWrapper>
    <SkeletonMeta>
      <Skeleton variant="text" width="70%" />
      <SkeletonMetaRow>
        <Skeleton variant="text" width="30%" />
        <Skeleton variant="text" width="35%" />
      </SkeletonMetaRow>
    </SkeletonMeta>
  </SkeletonCard>
)

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
  loading?: boolean
  onSelect: (photo: Photo) => void
  currentUserUid?: string
  onDeletePhoto?: (photo: Photo) => Promise<void>
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  loading = false,
  onSelect,
  currentUserUid,
  onDeletePhoto,
}) => {
  if (loading) {
    return (
      <Grid>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <PhotoGridSkeletonItem key={index} />
        ))}
      </Grid>
    )
  }

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
