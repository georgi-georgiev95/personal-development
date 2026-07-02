import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/shared/config/firebase/db'

export interface UserProfile {
  uid: string
  email: string
  username: string
  firstName: string
  lastName: string
  age: number | null
  photoURL?: string
  createdAt: Date | null
  lastLogin: Date | null
  postCount: number
  commentCount: number
}

export class UserServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = 'UserServiceError'
  }
}

export const createUserProfile = async (
  uid: string,
  email: string,
  username: string,
  firstName: string,
  lastName: string,
  age: number | null
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid)
    await setDoc(userRef, {
      uid,
      email,
      username,
      firstName,
      lastName,
      age,
      photoURL: null,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      postCount: 0,
      commentCount: 0,
    })
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw new UserServiceError(
      'Failed to create user profile',
      'PROFILE_CREATE_FAILED'
    )
  }
}

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
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
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw new UserServiceError(
      'Failed to fetch user profile',
      'PROFILE_FETCH_FAILED'
    )
  }
}

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, data)
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new UserServiceError(
      'Failed to update user profile',
      'PROFILE_UPDATE_FAILED'
    )
  }
}

export const updateLastLogin = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error updating last login:', error)
    throw new UserServiceError(
      'Failed to update last login',
      'LAST_LOGIN_UPDATE_FAILED'
    )
  }
}
