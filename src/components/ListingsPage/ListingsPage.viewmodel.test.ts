import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useListingsPageViewModel } from './ListingsPage.viewmodel'

// Mock the listingsService
vi.mock('@/services/listingsService', () => ({
  getAllListings: vi.fn(),
  updateListing: vi.fn(),
  deleteListing: vi.fn(),
}))

import {
  getAllListings,
  updateListing,
  deleteListing,
} from '@/services/listingsService'
import type { Listing } from '@/services/listingsService'

const mockListings: Listing[] = [
  {
    id: 'listing-1',
    title: 'Honda Civic 2020',
    description: 'Great car',
    price: 15000,
    photos: ['photo1.jpg'],
    userId: 'user-123',
    userEmail: 'user@example.com',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'listing-2',
    title: 'Toyota Camry 2019',
    description: 'Low mileage',
    price: 18000,
    photos: [],
    userId: 'user-456',
    userEmail: 'other@example.com',
    createdAt: new Date('2026-01-02'),
    updatedAt: new Date('2026-01-02'),
  },
]

describe('useListingsPageViewModel', () => {
  const currentUserId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getAllListings).mockResolvedValue(mockListings)
  })

  it('should initialize and load listings', async () => {
    const { result } = renderHook(() => useListingsPageViewModel(currentUserId))

    // Wait for the async effect to complete and listings to be populated
    await waitFor(() => {
      expect(result.current.state.listings).toHaveLength(2)
    })

    expect(getAllListings).toHaveBeenCalled()
  })

  it('should handle load error', async () => {
    vi.mocked(getAllListings).mockRejectedValue(new Error('Failed to load'))

    const { result } = renderHook(() => useListingsPageViewModel(currentUserId))

    await waitFor(() => {
      expect(result.current.state.error).toBe('Failed to load')
    })

    expect(result.current.state.listings).toHaveLength(0)
  })

  it('should identify editable listings by current user', async () => {
    const { result } = renderHook(() => useListingsPageViewModel(currentUserId))

    await waitFor(() => {
      expect(result.current.state.listings).toHaveLength(2)
    })

    // User owns listing-1
    expect(result.current.canEditListing(mockListings[0])).toBe(true)
    // User does not own listing-2
    expect(result.current.canEditListing(mockListings[1])).toBe(false)
  })

  it('should start and cancel editing', async () => {
    const { result } = renderHook(() => useListingsPageViewModel(currentUserId))

    await waitFor(() => {
      expect(result.current.state.listings).toHaveLength(2)
    })

    act(() => {
      result.current.startEditing(mockListings[0])
    })

    expect(result.current.state.editingId).toBe('listing-1')
    expect(result.current.state.editForm).not.toBeNull()
    expect(result.current.state.editForm?.title).toBe('Honda Civic 2020')

    act(() => {
      result.current.cancelEditing()
    })

    expect(result.current.state.editingId).toBeNull()
    expect(result.current.state.editForm).toBeNull()
  })

  it('should update edit form fields', async () => {
    const { result } = renderHook(() => useListingsPageViewModel(currentUserId))

    await waitFor(() => {
      expect(result.current.state.listings).toHaveLength(2)
    })

    act(() => {
      result.current.startEditing(mockListings[0])
    })

    act(() => {
      result.current.updateEditField('title', 'Updated Title')
    })

    expect(result.current.state.editForm?.title).toBe('Updated Title')

    act(() => {
      result.current.updateEditField('price', '20000')
    })

    expect(result.current.state.editForm?.price).toBe('20000')
  })

  it('should add and remove edit photos', async () => {
    const { result } = renderHook(() => useListingsPageViewModel(currentUserId))

    await waitFor(() => {
      expect(result.current.state.listings).toHaveLength(2)
    })

    act(() => {
      result.current.startEditing(mockListings[0])
    })

    const initialPhotoCount = result.current.state.editForm?.photos.length || 0

    act(() => {
      result.current.addEditPhoto('data:image/png;base64,newphoto')
    })

    expect(result.current.state.editForm?.photos).toHaveLength(
      initialPhotoCount + 1
    )

    act(() => {
      result.current.removeEditPhoto(0)
    })

    expect(result.current.state.editForm?.photos).toHaveLength(
      initialPhotoCount
    )
  })

  it('should save edit successfully', async () => {
    vi.mocked(updateListing).mockResolvedValue(undefined)

    const { result } = renderHook(() => useListingsPageViewModel(currentUserId))

    await waitFor(() => {
      expect(result.current.state.listings).toHaveLength(2)
    })

    act(() => {
      result.current.startEditing(mockListings[0])
    })

    act(() => {
      result.current.updateEditField('title', 'Updated Title')
      result.current.updateEditField('price', '20000')
    })

    await act(async () => {
      await result.current.saveEdit()
    })

    expect(updateListing).toHaveBeenCalledWith('listing-1', {
      title: 'Updated Title',
      description: 'Great car',
      price: 20000,
      photos: ['photo1.jpg'],
    })
    expect(result.current.state.editingId).toBeNull()
  })

  it('should show error for invalid price during edit', async () => {
    const { result } = renderHook(() => useListingsPageViewModel(currentUserId))

    await waitFor(() => {
      expect(result.current.state.listings).toHaveLength(2)
    })

    act(() => {
      result.current.startEditing(mockListings[0])
    })

    act(() => {
      result.current.updateEditField('price', 'invalid')
    })

    await act(async () => {
      await result.current.saveEdit()
    })

    expect(result.current.state.error).toBe('Please enter a valid price')
    expect(updateListing).not.toHaveBeenCalled()
  })

  it('should confirm and cancel delete', async () => {
    const { result } = renderHook(() => useListingsPageViewModel(currentUserId))

    await waitFor(() => {
      expect(result.current.state.listings).toHaveLength(2)
    })

    act(() => {
      result.current.confirmDelete('listing-1')
    })

    expect(result.current.state.deleteConfirmId).toBe('listing-1')

    act(() => {
      result.current.cancelDelete()
    })

    expect(result.current.state.deleteConfirmId).toBeNull()
  })

  it('should execute delete successfully', async () => {
    vi.mocked(deleteListing).mockResolvedValue(undefined)

    const { result } = renderHook(() => useListingsPageViewModel(currentUserId))

    await waitFor(() => {
      expect(result.current.state.listings).toHaveLength(2)
    })

    act(() => {
      result.current.confirmDelete('listing-1')
    })

    await act(async () => {
      await result.current.executeDelete()
    })

    expect(deleteListing).toHaveBeenCalledWith('listing-1')
    expect(result.current.state.deleteConfirmId).toBeNull()
  })

  it('should handle delete error', async () => {
    vi.mocked(deleteListing).mockRejectedValue(new Error('Delete failed'))

    const { result } = renderHook(() => useListingsPageViewModel(currentUserId))

    await waitFor(() => {
      expect(result.current.state.listings).toHaveLength(2)
    })

    act(() => {
      result.current.confirmDelete('listing-1')
    })

    await act(async () => {
      await result.current.executeDelete()
    })

    expect(result.current.state.error).toBe('Delete failed')
  })
})
