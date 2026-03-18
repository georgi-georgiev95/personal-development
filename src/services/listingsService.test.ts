import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Firebase Firestore
const mockAddDoc = vi.fn()
const mockGetDoc = vi.fn()
const mockGetDocs = vi.fn()
const mockUpdateDoc = vi.fn()
const mockDeleteDoc = vi.fn()
const mockDoc = vi.fn()
const mockCollection = vi.fn()
const mockQuery = vi.fn()
const mockOrderBy = vi.fn()
const mockServerTimestamp = vi.fn()

// Create a mock Timestamp class inside the factory
vi.mock('firebase/firestore', () => {
  class MockTimestamp {
    private date: Date
    constructor(date: Date) {
      this.date = date
    }
    toDate() {
      return this.date
    }
  }
  return {
    addDoc: (...args: unknown[]) => mockAddDoc(...args),
    getDoc: (...args: unknown[]) => mockGetDoc(...args),
    getDocs: (...args: unknown[]) => mockGetDocs(...args),
    updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
    deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
    doc: (...args: unknown[]) => mockDoc(...args),
    collection: (...args: unknown[]) => mockCollection(...args),
    query: (...args: unknown[]) => mockQuery(...args),
    orderBy: (...args: unknown[]) => mockOrderBy(...args),
    serverTimestamp: () => mockServerTimestamp(),
    Timestamp: MockTimestamp,
  }
})

vi.mock('@/firebase/firebase', () => ({
  db: {},
}))

// Import after mocking
import {
  createListing,
  getListing,
  getAllListings,
  updateListing,
  deleteListing,
  type CreateListingData,
} from './listingsService'

describe('listingsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDoc.mockReturnValue({ id: 'doc-ref' })
    mockCollection.mockReturnValue({ id: 'collection-ref' })
    mockQuery.mockReturnValue({ id: 'query-ref' })
    mockOrderBy.mockReturnValue({ id: 'order-ref' })
  })

  describe('createListing', () => {
    it('should create a listing and return the ID', async () => {
      mockAddDoc.mockResolvedValue({ id: 'new-listing-123' })

      const data: CreateListingData = {
        title: 'Honda Civic 2020',
        description: 'Great condition',
        price: 15000,
        photos: ['photo1.jpg'],
        userId: 'user-123',
        userEmail: 'test@example.com',
      }

      const result = await createListing(data)

      expect(result).toBe('new-listing-123')
      expect(mockAddDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: 'Honda Civic 2020',
          description: 'Great condition',
          price: 15000,
          photos: ['photo1.jpg'],
          userId: 'user-123',
          userEmail: 'test@example.com',
        })
      )
    })
  })

  describe('getListing', () => {
    it('should return listing when it exists', async () => {
      // Create a mock timestamp object that will pass instanceof check
      const mockTimestamp = { toDate: () => new Date('2026-01-01') }
      // Override the instanceof check by making the mock object work with the imported Timestamp
      Object.setPrototypeOf(
        mockTimestamp,
        Object.getPrototypeOf({ toDate: () => new Date() })
      )

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        id: 'listing-123',
        data: () => ({
          title: 'Honda Civic',
          description: 'Nice car',
          price: 15000,
          photos: ['photo.jpg'],
          userId: 'user-123',
          userEmail: 'test@example.com',
          createdAt: mockTimestamp,
          updatedAt: mockTimestamp,
        }),
      })

      const result = await getListing('listing-123')

      expect(result).not.toBeNull()
      expect(result?.id).toBe('listing-123')
      expect(result?.title).toBe('Honda Civic')
      expect(result?.price).toBe(15000)
    })

    it('should return null when listing does not exist', async () => {
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      })

      const result = await getListing('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('getAllListings', () => {
    it('should return all listings ordered by creation date', async () => {
      const mockTimestamp = { toDate: () => new Date('2026-01-01') }
      Object.setPrototypeOf(
        mockTimestamp,
        Object.getPrototypeOf({ toDate: () => new Date() })
      )

      mockGetDocs.mockResolvedValue({
        docs: [
          {
            id: 'listing-1',
            data: () => ({
              title: 'Car 1',
              description: 'Desc 1',
              price: 10000,
              photos: [],
              userId: 'user-1',
              userEmail: 'user1@example.com',
              createdAt: mockTimestamp,
              updatedAt: mockTimestamp,
            }),
          },
          {
            id: 'listing-2',
            data: () => ({
              title: 'Car 2',
              description: 'Desc 2',
              price: 20000,
              photos: ['photo.jpg'],
              userId: 'user-2',
              userEmail: 'user2@example.com',
              createdAt: mockTimestamp,
              updatedAt: mockTimestamp,
            }),
          },
        ],
      })

      const result = await getAllListings()

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('listing-1')
      expect(result[1].id).toBe('listing-2')
      expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc')
    })
  })

  describe('updateListing', () => {
    it('should update a listing with new data', async () => {
      mockUpdateDoc.mockResolvedValue(undefined)

      await updateListing('listing-123', {
        title: 'Updated Title',
        price: 18000,
      })

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          title: 'Updated Title',
          price: 18000,
        })
      )
    })
  })

  describe('deleteListing', () => {
    it('should delete a listing', async () => {
      mockDeleteDoc.mockResolvedValue(undefined)

      await deleteListing('listing-123')

      expect(mockDeleteDoc).toHaveBeenCalled()
      expect(mockDoc).toHaveBeenCalledWith(
        expect.anything(),
        'listings',
        'listing-123'
      )
    })
  })
})
