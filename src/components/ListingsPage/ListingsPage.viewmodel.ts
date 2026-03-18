import { useState, useEffect, useCallback } from 'react'
import type { ListingsPageState, EditFormData } from './ListingsPage.types'
import {
  getAllListings,
  updateListing,
  deleteListing,
  type Listing,
} from '@/services/listingsService'

const initialState: ListingsPageState = {
  loading: false,
  error: null,
  listings: [],
  editingId: null,
  editForm: null,
  deleteConfirmId: null,
}

export function useListingsPageViewModel(currentUserId: string) {
  const [state, setState] = useState<ListingsPageState>(initialState)

  const loadListings = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const listings = await getAllListings()
      setState((s) => ({ ...s, loading: false, listings }))
    } catch (error) {
      setState((s) => ({
        ...s,
        loading: false,
        error:
          error instanceof Error ? error.message : 'Failed to load listings',
      }))
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(() => loadListings())
  }, [loadListings])

  const startEditing = useCallback((listing: Listing) => {
    setState((s) => ({
      ...s,
      editingId: listing.id,
      editForm: {
        title: listing.title,
        description: listing.description,
        price: String(listing.price),
        photos: listing.photos,
      },
    }))
  }, [])

  const cancelEditing = useCallback(() => {
    setState((s) => ({
      ...s,
      editingId: null,
      editForm: null,
    }))
  }, [])

  const updateEditField = useCallback(
    <K extends keyof EditFormData>(field: K, value: EditFormData[K]) => {
      setState((s) => ({
        ...s,
        editForm: s.editForm ? { ...s.editForm, [field]: value } : null,
      }))
    },
    []
  )

  const addEditPhoto = useCallback((base64: string) => {
    setState((s) => ({
      ...s,
      editForm: s.editForm
        ? { ...s.editForm, photos: [...s.editForm.photos, base64] }
        : null,
    }))
  }, [])

  const removeEditPhoto = useCallback((index: number) => {
    setState((s) => ({
      ...s,
      editForm: s.editForm
        ? {
            ...s.editForm,
            photos: s.editForm.photos.filter((_, i) => i !== index),
          }
        : null,
    }))
  }, [])

  const saveEdit = useCallback(async () => {
    const { editingId, editForm } = state
    if (!editingId || !editForm) return

    const price = parseFloat(editForm.price)
    if (isNaN(price) || price <= 0) {
      setState((s) => ({ ...s, error: 'Please enter a valid price' }))
      return
    }

    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      await updateListing(editingId, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        price,
        photos: editForm.photos,
      })
      await loadListings()
      setState((s) => ({ ...s, editingId: null, editForm: null }))
    } catch (error) {
      setState((s) => ({
        ...s,
        loading: false,
        error:
          error instanceof Error ? error.message : 'Failed to update listing',
      }))
    }
  }, [state, loadListings])

  const confirmDelete = useCallback((id: string) => {
    setState((s) => ({ ...s, deleteConfirmId: id }))
  }, [])

  const cancelDelete = useCallback(() => {
    setState((s) => ({ ...s, deleteConfirmId: null }))
  }, [])

  const executeDelete = useCallback(async () => {
    const { deleteConfirmId } = state
    if (!deleteConfirmId) return

    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      await deleteListing(deleteConfirmId)
      await loadListings()
      setState((s) => ({ ...s, deleteConfirmId: null }))
    } catch (error) {
      setState((s) => ({
        ...s,
        loading: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete listing',
      }))
    }
  }, [state, loadListings])

  const canEditListing = useCallback(
    (listing: Listing) => listing.userId === currentUserId,
    [currentUserId]
  )

  return {
    state,
    loadListings,
    startEditing,
    cancelEditing,
    updateEditField,
    addEditPhoto,
    removeEditPhoto,
    saveEdit,
    confirmDelete,
    cancelDelete,
    executeDelete,
    canEditListing,
  }
}
