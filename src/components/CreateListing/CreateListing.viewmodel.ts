import { useState, useCallback } from 'react'
import type {
  CreateListingState,
  CreateListingFormData,
} from './CreateListing.types'
import { createListing, type ListingSpecs } from '@/services/listingsService'

const initialForm: CreateListingFormData = {
  title: '',
  description: '',
  price: '',
  photos: [],
  engine: '',
  mileage: '',
  power: '',
  transmission: '',
  driveType: '',
  bodyType: '',
  fuelConsumption: '',
  euroStandard: '',
  doors: '',
  seats: '',
  color: '',
  interior: '',
  firstRegistration: '',
  equipment: [],
  condition: [],
}

const initialState: CreateListingState = {
  loading: false,
  error: null,
  success: false,
  form: initialForm,
}

export function useCreateListingViewModel(userId: string, userEmail: string) {
  const [state, setState] = useState<CreateListingState>(initialState)

  const updateField = useCallback(
    <K extends keyof CreateListingFormData>(
      field: K,
      value: CreateListingFormData[K]
    ) => {
      setState((s) => ({
        ...s,
        form: { ...s.form, [field]: value },
      }))
    },
    []
  )

  const addPhoto = useCallback((base64: string) => {
    setState((s) => ({
      ...s,
      form: { ...s.form, photos: [...s.form.photos, base64] },
    }))
  }, [])

  const removePhoto = useCallback((index: number) => {
    setState((s) => ({
      ...s,
      form: {
        ...s.form,
        photos: s.form.photos.filter((_, i) => i !== index),
      },
    }))
  }, [])

  const resetForm = useCallback(() => {
    setState(initialState)
  }, [])

  const submitListing = useCallback(async () => {
    const { form } = state
    // require title and price; description is optional
    if (!form.title.trim() || !form.price.trim()) {
      // keep legacy error message for backward compatibility in tests
      setState((s) => ({ ...s, error: 'Please fill in all required fields' }))
      return
    }

    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) {
      setState((s) => ({ ...s, error: 'Please enter a valid price' }))
      return
    }

    setState((s) => ({ ...s, loading: true, error: null }))

    try {
      // Build specs object and only include it if it has any values
      const specs: Partial<ListingSpecs> = {}
      if (form.engine?.trim()) specs.engine = form.engine.trim()
      if (form.mileage?.trim()) specs.mileage = form.mileage.trim()
      if (form.power?.trim()) specs.power = form.power.trim()
      if (form.transmission?.trim())
        specs.transmission = form.transmission.trim()
      if (form.driveType?.trim()) specs.driveType = form.driveType.trim()
      if (form.bodyType?.trim()) specs.bodyType = form.bodyType.trim()
      if (form.fuelConsumption?.trim())
        specs.fuelConsumption = form.fuelConsumption.trim()
      if (form.euroStandard?.trim())
        specs.euroStandard = form.euroStandard.trim()
      if (form.doors?.trim()) specs.doors = form.doors.trim()
      if (form.seats?.trim()) specs.seats = form.seats.trim()
      if (form.color?.trim()) specs.color = form.color.trim()
      if (form.interior?.trim()) specs.interior = form.interior.trim()
      if (form.firstRegistration?.trim())
        specs.firstRegistration = form.firstRegistration.trim()
      // equipment and condition are arrays now (tags)
      if (Array.isArray(form.equipment) && form.equipment.length)
        specs.equipment = form.equipment.map((s) => s.trim())
      if (Array.isArray(form.condition) && form.condition.length)
        specs.condition = form.condition.map((s) => s.trim())

      const payload: {
        title: string
        description: string
        price: number
        photos: string[]
        userId: string
        userEmail: string
        specs?: Partial<ListingSpecs>
      } = {
        title: form.title.trim(),
        description: form.description?.trim() || '',
        price,
        photos: form.photos,
        userId,
        userEmail,
      }
      if (Object.keys(specs).length > 0) payload.specs = specs

      await createListing(payload)
      setState({ ...initialState, success: true })
    } catch (error) {
      setState((s) => ({
        ...s,
        loading: false,
        error:
          error instanceof Error ? error.message : 'Failed to create listing',
      }))
    }
  }, [state, userId, userEmail])

  return {
    state,
    updateField,
    addPhoto,
    removePhoto,
    resetForm,
    submitListing,
  }
}
