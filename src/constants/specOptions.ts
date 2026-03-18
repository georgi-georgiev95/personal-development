export const engineOptions = [
  { value: '', label: 'None' },
  { value: '1.6', label: '1.6' },
  { value: '2.0', label: '2.0' },
  { value: '2.5', label: '2.5' },
  { value: '3.0 TDI', label: '3.0 TDI' },
]

export const mileageOptions = [
  { value: '', label: 'Any' },
  { value: '<50,000', label: '<50,000 km' },
  { value: '50,000-100,000', label: '50,000-100,000 km' },
  { value: '100,000-150,000', label: '100,000-150,000 km' },
  { value: '150,000-200,000', label: '150,000-200,000 km' },
  { value: '>200,000', label: '>200,000 km' },
]

export const powerOptions = [
  { value: '', label: 'Any' },
  { value: '100-150', label: '100-150 hp' },
  { value: '150-200', label: '150-200 hp' },
  { value: '200-300', label: '200-300 hp' },
  { value: '>300', label: '>300 hp' },
]

export const transmissionOptions = [
  { value: '', label: 'Any' },
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic' },
  { value: 'Tiptronic', label: 'Tiptronic' },
  { value: 'CVT', label: 'CVT' },
]

export const driveTypeOptions = [
  { value: '', label: 'Any' },
  { value: 'FWD', label: 'FWD' },
  { value: 'RWD', label: 'RWD' },
  { value: 'AWD', label: 'AWD/4WD' },
  { value: 'Quattro', label: 'Quattro' },
]

export const bodyTypeOptions = [
  { value: '', label: 'Any' },
  { value: 'Sedan', label: 'Sedan' },
  { value: 'Hatchback', label: 'Hatchback' },
  { value: 'Wagon', label: 'Wagon/Allroad' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Coupe', label: 'Coupe' },
]

export const consumptionOptions = [
  { value: '', label: 'Any' },
  { value: '<5', label: '<5 L/100 km' },
  { value: '5-6', label: '5-6 L/100 km' },
  { value: '6-8', label: '6-8 L/100 km' },
  { value: '>8', label: '>8 L/100 km' },
]

export const euroOptions = [
  { value: '', label: 'Any' },
  { value: 'Euro 3', label: 'Euro 3' },
  { value: 'Euro 4', label: 'Euro 4' },
  { value: 'Euro 5', label: 'Euro 5' },
  { value: 'Euro 6', label: 'Euro 6' },
]

export const doorsOptions = [
  { value: '', label: 'Any' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
]

export const seatsOptions = [
  { value: '', label: 'Any' },
  { value: '2', label: '2' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '7', label: '7' },
]

export const colorOptions = [
  { value: '', label: 'Any' },
  { value: 'Black', label: 'Black' },
  { value: 'White', label: 'White' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Blue', label: 'Blue' },
  { value: 'Red', label: 'Red' },
]

export const interiorOptions = [
  { value: '', label: 'Any' },
  { value: 'Cloth', label: 'Cloth' },
  { value: 'Leather', label: 'Leather' },
  { value: 'Leatherette', label: 'Leatherette' },
]

export const getRegistrationYears = (count = 30) =>
  Array.from({ length: count }).map((_, i) => String(2026 - i))
