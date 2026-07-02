import React, { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/components/useAuth'
import { useIsAdmin } from '@/features/auth/components/useIsAdmin'
import { getUserProfile } from '@/entities/user'
import type { Photo } from '@/entities/photobook'
import {
  DeletePhotoToken,
  SubscribePhotosToken,
  UploadPhotoToken,
} from '@/entities/photobook'
import { useInjectable } from '@/shared/di'
import { UploadForm } from '../components/UploadForm'
import { PhotoGrid } from '../components/PhotoGrid'
import { PhotoDetail } from '../components/PhotoDetail'
import {
  CmsLink,
  PageEyebrow,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrapper,
} from './PhotobookPage.styles'

const PhotobookPage: React.FC = () => {
  const { user } = useAuth()
  const isAdmin = useIsAdmin()
  const subscribePhotos = useInjectable(SubscribePhotosToken)
  const uploadPhoto = useInjectable(UploadPhotoToken)
  const deletePhoto = useInjectable(DeletePhotoToken)

  const [photos, setPhotos] = useState<Photo[]>([])
  const [photosLoading, setPhotosLoading] = useState(true)
  const [authorName, setAuthorName] = useState('')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  useEffect(
    () =>
      subscribePhotos((nextPhotos) => {
        setPhotos(nextPhotos)
        setPhotosLoading(false)
      }),
    [subscribePhotos]
  )

  useEffect(() => {
    if (!user) return undefined
    let cancelled = false
    void (async () => {
      try {
        const profile = await getUserProfile(user.uid)
        if (!cancelled) {
          setAuthorName(profile?.username ?? user.email ?? 'Anonymous')
        }
      } catch {
        if (!cancelled) setAuthorName(user.email ?? 'Anonymous')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  const handleUpload = async (file: File, caption: string) => {
    if (!user) return
    await uploadPhoto(user.uid, authorName, file, caption)
  }

  const handleDeletePhoto = async (photo: Photo) => {
    if (!user) return
    await deletePhoto(photo, user.uid, false)
    setSelectedPhoto(null)
  }

  return (
    <PageWrapper>
      <PageHeader>
        <div>
          <PageEyebrow>Community</PageEyebrow>
          <PageTitle>Photobook</PageTitle>
          <PageSubtitle>
            A shared space to upload photos, comment, and react together.
          </PageSubtitle>
        </div>
        {isAdmin ? <CmsLink to="/photobook/cms">Manage CMS</CmsLink> : null}
      </PageHeader>
      {user ? (
        <UploadForm onUpload={handleUpload} />
      ) : (
        <PageSubtitle>Sign in to upload a photo.</PageSubtitle>
      )}
      <PhotoGrid
        photos={photos}
        loading={photosLoading}
        onSelect={setSelectedPhoto}
        currentUserUid={user?.uid}
        onDeletePhoto={handleDeletePhoto}
      />
      <PhotoDetail
        photo={selectedPhoto}
        open={selectedPhoto !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPhoto(null)
        }}
        currentUserUid={user?.uid}
        currentUserName={authorName || undefined}
        onDeletePhoto={handleDeletePhoto}
      />
    </PageWrapper>
  )
}

export default PhotobookPage
