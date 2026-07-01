import React, { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/components/useAuth'
import type { Photo } from '@/entities/photobook'
import { DeletePhotoToken, SubscribePhotosToken } from '@/entities/photobook'
import { useInjectable } from '@/shared/di'
import { ModerationPhotoList } from '../components/ModerationPhotoList'
import { ModerationCommentList } from '../components/ModerationCommentList'
import {
  PageTitle,
  PageWrapper,
  Section,
  SectionTitle,
} from './PhotobookCmsPage.styles'

const PhotobookCmsPage: React.FC = () => {
  const { user } = useAuth()
  const subscribePhotos = useInjectable(SubscribePhotosToken)
  const deletePhoto = useInjectable(DeletePhotoToken)

  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null)

  useEffect(() => subscribePhotos(setPhotos), [subscribePhotos])

  const handleDeletePhoto = async (photo: Photo) => {
    if (!user) return
    await deletePhoto(photo, user.uid, true)
    setSelectedPhotoId((current) => (current === photo.id ? null : current))
  }

  return (
    <PageWrapper>
      <PageTitle>Photobook CMS</PageTitle>
      <Section>
        <SectionTitle>Photos</SectionTitle>
        <ModerationPhotoList
          photos={photos}
          selectedPhotoId={selectedPhotoId}
          onSelectPhoto={(photo) => setSelectedPhotoId(photo.id)}
          onDeletePhoto={handleDeletePhoto}
        />
      </Section>
      {selectedPhotoId && user ? (
        <Section>
          <SectionTitle>Comments</SectionTitle>
          <ModerationCommentList
            photoId={selectedPhotoId}
            requesterUid={user.uid}
          />
        </Section>
      ) : null}
    </PageWrapper>
  )
}

export default PhotobookCmsPage
