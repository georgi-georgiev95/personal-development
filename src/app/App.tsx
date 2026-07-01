import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { Navigation } from '@/shared/components/Navigation'
import { StarFieldBackground } from '@/shared/components/StarFieldBackground'
import { DIProvider, type Binding } from '@/shared/di'
import { CheckIsAdminToken, checkIsAdmin } from '@/entities/admin'
import {
  AddCommentToken,
  DeleteCommentToken,
  DeletePhotoToken,
  SubscribeCommentsToken,
  SubscribePhotosToken,
  SubscribeReactionToken,
  ToggleReactionToken,
  UploadPhotoToken,
  addComment,
  deleteComment,
  deletePhoto,
  subscribeComments,
  subscribePhotos,
  subscribeReaction,
  toggleReaction,
  uploadPhoto,
} from '@/entities/photobook'
import { AppRoot, AppContent, CanvasBackground } from './App.styles'
import { AppRoutes } from './routes'

const diBindings: Binding<unknown>[] = [
  [UploadPhotoToken, uploadPhoto],
  [SubscribePhotosToken, subscribePhotos],
  [DeletePhotoToken, deletePhoto],
  [AddCommentToken, addComment],
  [SubscribeCommentsToken, subscribeComments],
  [DeleteCommentToken, deleteComment],
  [SubscribeReactionToken, subscribeReaction],
  [ToggleReactionToken, toggleReaction],
  [CheckIsAdminToken, checkIsAdmin],
]

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DIProvider bindings={diBindings}>
        <Router>
          <AppRoot>
            <CanvasBackground>
              <StarFieldBackground />
            </CanvasBackground>
            <Navigation />
            <AppContent>
              <AppRoutes />
            </AppContent>
          </AppRoot>
        </Router>
      </DIProvider>
    </AuthProvider>
  )
}

export default App
