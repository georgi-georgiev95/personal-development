import React from 'react'
import type { Photo } from '@/entities/photobook'
import { Card, Caption, Meta, MetaRow, Thumbnail } from './PhotoGridItem.styles'

interface PhotoGridItemProps {
  photo: Photo
  onSelect: () => void
}

export const PhotoGridItem: React.FC<PhotoGridItemProps> = ({
  photo,
  onSelect,
}) => (
  <Card type="button" onClick={onSelect}>
    <Thumbnail src={photo.imageURL} alt={photo.caption || photo.authorName} />
    <Meta>
      <Caption>{photo.caption || photo.authorName}</Caption>
      <MetaRow>
        <span>{photo.authorName}</span>
        <span>{photo.commentCount} comments</span>
      </MetaRow>
    </Meta>
  </Card>
)
