import { useEffect, useState } from 'react'
import {
  SubscribePhotoReactionToken,
  TogglePhotoReactionToken,
} from '@/entities/photobook'
import { useInjectable } from '@/shared/di'

export const usePhotoLike = (photoId: string, uid: string | undefined) => {
  const subscribePhotoReaction = useInjectable(SubscribePhotoReactionToken)
  const togglePhotoReaction = useInjectable(TogglePhotoReactionToken)
  const [liked, setLiked] = useState(false)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!uid) return undefined
    return subscribePhotoReaction(photoId, uid, setLiked)
  }, [subscribePhotoReaction, photoId, uid])

  const effectiveLiked = uid ? liked : false

  const toggleLike = () => {
    if (!uid || pending) return
    const nextLiked = !effectiveLiked
    setLiked(nextLiked)
    setPending(true)
    togglePhotoReaction(photoId, uid, effectiveLiked)
      .catch(() => setLiked(!nextLiked))
      .finally(() => setPending(false))
  }

  return { liked: effectiveLiked, pending, toggleLike }
}
