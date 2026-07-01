import React from 'react'
import type { Photo } from '@/entities/photobook'
import { PhotoGridItem } from '../PhotoGridItem'
import { EmptyState, Grid } from './PhotoGrid.styles'

interface PhotoGridProps {
  photos: Photo[]
  onSelect: (photo: Photo) => void
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onSelect }) => {
  if (photos.length === 0) {
    return <EmptyState>No photos yet. Be the first to share one!</EmptyState>
  }

  return (
    <Grid>
      {photos.map((photo) => (
        <PhotoGridItem
          key={photo.id}
          photo={photo}
          onSelect={() => onSelect(photo)}
        />
      ))}
    </Grid>
  )
}
