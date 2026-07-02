import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageSpinner } from '@/shared/components/PageSpinner'
import { AdminRoute } from '@/features/auth/components/AdminRoute'
import { DIProvider, type Binding } from '@/shared/di'
import { CheckIsAdminToken, checkIsAdmin } from '@/entities/admin'
import {
  AddCommentToken,
  DeleteCommentToken,
  DeletePhotoToken,
  SubscribeCommentsToken,
  SubscribePhotosToken,
  SubscribePhotoReactionToken,
  SubscribeReactionToken,
  ToggleReactionToken,
  TogglePhotoReactionToken,
  UploadPhotoToken,
  addComment,
  deleteComment,
  deletePhoto,
  subscribeComments,
  subscribePhotos,
  subscribePhotoReaction,
  subscribeReaction,
  toggleReaction,
  togglePhotoReaction,
  uploadPhoto,
} from '@/entities/photobook'

const PhotobookPage = lazy(
  () => import('@/features/photobook/pages/PhotobookPage')
)
const PhotobookCmsPage = lazy(
  () => import('@/features/photobook/pages/PhotobookCmsPage')
)

const diBindings: Binding<unknown>[] = [
  [UploadPhotoToken, uploadPhoto],
  [SubscribePhotosToken, subscribePhotos],
  [DeletePhotoToken, deletePhoto],
  [AddCommentToken, addComment],
  [SubscribeCommentsToken, subscribeComments],
  [DeleteCommentToken, deleteComment],
  [SubscribeReactionToken, subscribeReaction],
  [ToggleReactionToken, toggleReaction],
  [SubscribePhotoReactionToken, subscribePhotoReaction],
  [TogglePhotoReactionToken, togglePhotoReaction],
  [CheckIsAdminToken, checkIsAdmin],
]

/**
 * The whole photobook subtree — DI bindings, admin gate, and pages — lives
 * behind one lazy route so its entities (and the Firestore SDK they import)
 * stay out of the entry chunk.
 */
const PhotobookSection = () => (
  <DIProvider bindings={diBindings}>
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route index element={<PhotobookPage />} />
        <Route
          path="cms"
          element={
            <AdminRoute>
              <PhotobookCmsPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/photobook" replace />} />
      </Routes>
    </Suspense>
  </DIProvider>
)

export default PhotobookSection
