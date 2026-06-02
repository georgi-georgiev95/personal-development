import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/shared/config/firebase/firebase'

export interface UserProfile {
  uid: string
  email: string
  username: string
  photoURL?: string
  createdAt: Date | null
  lastLogin: Date | null
  postCount: number
  commentCount: number
}

export const createUserProfile = async (
  uid: string,
  email: string,
  username: string
): Promise<void> => {
  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, {
    uid,
    email,
    username,
    photoURL: null,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    postCount: 0,
    commentCount: 0,
  })
}

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    const data = userSnap.data()
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || null,
      lastLogin: data.lastLogin?.toDate() || null,
    } as UserProfile
  }
  return null
}

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, data)
}

export const updateLastLogin = async (uid: string): Promise<void> => {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    lastLogin: serverTimestamp(),
  })
}
