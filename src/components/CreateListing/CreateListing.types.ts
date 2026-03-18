export type CreateListingProps = object

export interface CreateListingFormData {
  title: string
  description: string
  price: string
  photos: string[]
  // Structured specs
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

export interface CreateListingState {
  loading: boolean
  error: string | null
  success: boolean
  form: CreateListingFormData
}
