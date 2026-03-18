import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebase'

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  photos: string[] // base64 encoded images
  userId: string
  userEmail: string
  specs?: ListingSpecs
  createdAt: Date | null
  updatedAt: Date | null
}

export interface ListingSpecs {
  engine?: string
  mileage?: string
  power?: string
  transmission?: string
  driveType?: string
  bodyType?: string
  fuelConsumption?: string
  euroStandard?: string
  doors?: string
  seats?: string
  color?: string
  interior?: string
  firstRegistration?: string
  equipment?: string[]
  condition?: string[]
}

export interface CreateListingData {
  title: string
  description?: string
  price: number
  photos: string[]
  userId: string
  userEmail: string
  specs?: ListingSpecs
}

export interface UpdateListingData {
  title?: string
  description?: string
  price?: number
  photos?: string[]
  specs?: ListingSpecs
}

const LISTINGS_COLLECTION = 'listings'

/**
 * Create a new listing
 */
export const createListing = async (
  data: CreateListingData
): Promise<string> => {
  const listingsRef = collection(db, LISTINGS_COLLECTION)
  const docRef = await addDoc(listingsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Get a single listing by ID
 */
export const getListing = async (id: string): Promise<Listing | null> => {
  const docRef = doc(db, LISTINGS_COLLECTION, id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return null
  }

  const data = docSnap.data()
  return {
    id: docSnap.id,
    title: data.title,
    description: data.description,
    price: data.price,
    photos: data.photos || [],
    specs: data.specs || {},
    userId: data.userId,
    userEmail: data.userEmail,
    createdAt:
      data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
    updatedAt:
      data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
  }
}

/**
 * Get all listings ordered by creation date (newest first)
 */
export const getAllListings = async (): Promise<Listing[]> => {
  const listingsRef = collection(db, LISTINGS_COLLECTION)
  const q = query(listingsRef, orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      title: data.title,
      description: data.description,
      price: data.price,
      photos: data.photos || [],
      specs: data.specs || {},
      userId: data.userId,
      userEmail: data.userEmail,
      createdAt:
        data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
      updatedAt:
        data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
    }
  })
}

/**
 * Update a listing
 */
export const updateListing = async (
  id: string,
  data: UpdateListingData
): Promise<void> => {
  const docRef = doc(db, LISTINGS_COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete a listing
 */
export const deleteListing = async (id: string): Promise<void> => {
  const docRef = doc(db, LISTINGS_COLLECTION, id)
  await deleteDoc(docRef)
}
