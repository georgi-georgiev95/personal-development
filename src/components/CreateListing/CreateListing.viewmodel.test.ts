import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCreateListingViewModel } from './CreateListing.viewmodel'

// Mock the listingsService
vi.mock('@/services/listingsService', () => ({
  createListing: vi.fn(),
}))

import { createListing } from '@/services/listingsService'

describe('useCreateListingViewModel', () => {
  const mockUserId = 'user-123'
  const mockUserEmail = 'test@example.com'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() =>
      useCreateListingViewModel(mockUserId, mockUserEmail)
    )

    expect(result.current.state.loading).toBe(false)
    expect(result.current.state.error).toBeNull()
    expect(result.current.state.success).toBe(false)
    expect(result.current.state.form.title).toBe('')
    expect(result.current.state.form.description).toBe('')
    expect(result.current.state.form.price).toBe('')
    expect(result.current.state.form.photos).toEqual([])
  })

  it('should update form fields', () => {
    const { result } = renderHook(() =>
      useCreateListingViewModel(mockUserId, mockUserEmail)
    )

    act(() => {
      result.current.updateField('title', 'Test Car')
    })

    expect(result.current.state.form.title).toBe('Test Car')

    act(() => {
      result.current.updateField('description', 'A nice car')
    })

    expect(result.current.state.form.description).toBe('A nice car')

    act(() => {
      result.current.updateField('price', '15000')
    })

    expect(result.current.state.form.price).toBe('15000')
  })

  it('should add and remove photos', () => {
    const { result } = renderHook(() =>
      useCreateListingViewModel(mockUserId, mockUserEmail)
    )

    act(() => {
      result.current.addPhoto('data:image/png;base64,photo1')
    })

    expect(result.current.state.form.photos).toHaveLength(1)
    expect(result.current.state.form.photos[0]).toBe(
      'data:image/png;base64,photo1'
    )

    act(() => {
      result.current.addPhoto('data:image/png;base64,photo2')
    })

    expect(result.current.state.form.photos).toHaveLength(2)

    act(() => {
      result.current.removePhoto(0)
    })

    expect(result.current.state.form.photos).toHaveLength(1)
    expect(result.current.state.form.photos[0]).toBe(
      'data:image/png;base64,photo2'
    )
  })

  it('should show error when required fields are empty', async () => {
    const { result } = renderHook(() =>
      useCreateListingViewModel(mockUserId, mockUserEmail)
    )

    await act(async () => {
      await result.current.submitListing()
    })

    expect(result.current.state.error).toBe(
      'Please fill in all required fields'
    )
    expect(createListing).not.toHaveBeenCalled()
  })

  it('should show error for invalid price', async () => {
    const { result } = renderHook(() =>
      useCreateListingViewModel(mockUserId, mockUserEmail)
    )

    act(() => {
      result.current.updateField('title', 'Test Car')
      result.current.updateField('description', 'A nice car')
      result.current.updateField('price', 'invalid')
    })

    await act(async () => {
      await result.current.submitListing()
    })

    expect(result.current.state.error).toBe('Please enter a valid price')
    expect(createListing).not.toHaveBeenCalled()
  })

  it('should submit listing successfully', async () => {
    vi.mocked(createListing).mockResolvedValue('listing-123')

    const { result } = renderHook(() =>
      useCreateListingViewModel(mockUserId, mockUserEmail)
    )

    act(() => {
      result.current.updateField('title', 'Test Car')
      result.current.updateField('description', 'A nice car')
      result.current.updateField('price', '15000')
    })

    await act(async () => {
      await result.current.submitListing()
    })

    expect(createListing).toHaveBeenCalledWith({
      title: 'Test Car',
      description: 'A nice car',
      price: 15000,
      photos: [],
      userId: mockUserId,
      userEmail: mockUserEmail,
    })
    expect(result.current.state.success).toBe(true)
    expect(result.current.state.loading).toBe(false)
  })

  it('should handle submission error', async () => {
    vi.mocked(createListing).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() =>
      useCreateListingViewModel(mockUserId, mockUserEmail)
    )

    act(() => {
      result.current.updateField('title', 'Test Car')
      result.current.updateField('description', 'A nice car')
      result.current.updateField('price', '15000')
    })

    await act(async () => {
      await result.current.submitListing()
    })

    expect(result.current.state.error).toBe('Network error')
    expect(result.current.state.success).toBe(false)
  })

  it('should reset form', () => {
    const { result } = renderHook(() =>
      useCreateListingViewModel(mockUserId, mockUserEmail)
    )

    act(() => {
      result.current.updateField('title', 'Test Car')
      result.current.updateField('description', 'A nice car')
      result.current.addPhoto('data:image/png;base64,photo1')
    })

    expect(result.current.state.form.title).toBe('Test Car')

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.state.form.title).toBe('')
    expect(result.current.state.form.description).toBe('')
    expect(result.current.state.form.photos).toEqual([])
  })
})
