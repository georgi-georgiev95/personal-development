export interface Photo {
  id: string
  authorUid: string
  authorName: string
  storagePath: string
  imageURL: string
  caption: string
  createdAt: Date | null
  commentCount: number
}

export interface PhotoComment {
  id: string
  photoId: string
  authorUid: string
  authorName: string
  text: string
  createdAt: Date | null
  reactionCount: number
}
