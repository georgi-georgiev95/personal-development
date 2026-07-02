export interface Photo {
  id: string
  authorUid: string
  authorName: string
  imageURL: string
  caption: string
  createdAt: Date | null
  commentCount: number
  reactionCount: number
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
