import type { Listing } from '@/services/listingsService'

export type ListingsPageProps = object

export interface ListingsPageState {
  loading: boolean
  error: string | null
  listings: Listing[]
  editingId: string | null
  editForm: EditFormData | null
  deleteConfirmId: string | null
}

export interface EditFormData {
  title: string
  description: string
  price: string
  photos: string[]
}
