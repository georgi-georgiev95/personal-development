import React, { useCallback } from 'react'
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  Chip,
} from '@mui/material'
import {
  engineOptions,
  mileageOptions,
  powerOptions,
  transmissionOptions,
  driveTypeOptions,
  bodyTypeOptions,
  consumptionOptions,
  euroOptions,
  doorsOptions,
  seatsOptions,
  colorOptions,
  interiorOptions,
  getRegistrationYears,
} from '@/constants/specOptions'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { useCreateListingViewModel } from './CreateListing.viewmodel'
import {
  Container,
  FormTitle,
  FormGroup,
  PhotosContainer,
  PhotoPreview,
  PhotoImage,
  RemovePhotoButton,
  UploadButton,
  SuccessMessage,
} from './CreateListing.styles'
import type { CreateListingProps } from './CreateListing.types'
import { useAuth } from '@/components/useAuth'

export const CreateListing: React.FC<CreateListingProps> = () => {
  const { user } = useAuth()
  const {
    state,
    updateField,
    addPhoto,
    removePhoto,
    resetForm,
    submitListing,
  } = useCreateListingViewModel(user?.uid || '', user?.email || '')

  const handlePhotoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files) return

      Array.from(files).forEach((file) => {
        if (file.size > 1024 * 1024) {
          alert('Each image must be less than 1MB')
          return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
          addPhoto(reader.result as string)
        }
        reader.readAsDataURL(file)
      })

      // Reset input value to allow selecting the same file again
      e.target.value = ''
    },
    [addPhoto]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      void submitListing()
    },
    [submitListing]
  )

  if (state.success) {
    return (
      <Container>
        <SuccessMessage>Listing created successfully!</SuccessMessage>
        <Button variant="contained" onClick={resetForm}>
          Create Another Listing
        </Button>
      </Container>
    )
  }

  return (
    <Container>
      <FormTitle>Create New Listing</FormTitle>

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <TextField
            label="Title"
            fullWidth
            required
            value={state.form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g., 2020 Honda Civic"
          />
        </FormGroup>

        <FormGroup>
          <TextField
            label="Price ($)"
            fullWidth
            required
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={state.form.price}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="e.g., 15000"
          />
        </FormGroup>

        <FormGroup>
          <TextField
            label="Description (optional)"
            fullWidth
            multiline
            rows={3}
            value={state.form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Extra details (optional)"
          />
        </FormGroup>

        <FormTitle>Specifications</FormTitle>
        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="engine-label">Engine</InputLabel>
            <Select
              labelId="engine-label"
              value={state.form.engine || ''}
              label="Engine"
              onChange={(e) => updateField('engine', e.target.value as string)}
            >
              {engineOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="mileage-label">Mileage</InputLabel>
            <Select
              labelId="mileage-label"
              value={state.form.mileage || ''}
              label="Mileage"
              onChange={(e) => updateField('mileage', e.target.value as string)}
            >
              {mileageOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="power-label">Power</InputLabel>
            <Select
              labelId="power-label"
              value={state.form.power || ''}
              label="Power"
              onChange={(e) => updateField('power', e.target.value as string)}
            >
              {powerOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="transmission-label">Transmission</InputLabel>
            <Select
              labelId="transmission-label"
              value={state.form.transmission || ''}
              label="Transmission"
              onChange={(e) =>
                updateField('transmission', e.target.value as string)
              }
            >
              {transmissionOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="drive-label">Drive Type</InputLabel>
            <Select
              labelId="drive-label"
              value={state.form.driveType || ''}
              label="Drive Type"
              onChange={(e) =>
                updateField('driveType', e.target.value as string)
              }
            >
              {driveTypeOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="body-label">Body Type</InputLabel>
            <Select
              labelId="body-label"
              value={state.form.bodyType || ''}
              label="Body Type"
              onChange={(e) =>
                updateField('bodyType', e.target.value as string)
              }
            >
              {bodyTypeOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="consumption-label">Fuel Consumption</InputLabel>
            <Select
              labelId="consumption-label"
              value={state.form.fuelConsumption || ''}
              label="Fuel Consumption"
              onChange={(e) =>
                updateField('fuelConsumption', e.target.value as string)
              }
            >
              {consumptionOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="euro-label">Euro Standard</InputLabel>
            <Select
              labelId="euro-label"
              value={state.form.euroStandard || ''}
              label="Euro Standard"
              onChange={(e) =>
                updateField('euroStandard', e.target.value as string)
              }
            >
              {euroOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="doors-label">Doors</InputLabel>
            <Select
              labelId="doors-label"
              value={state.form.doors || ''}
              label="Doors"
              onChange={(e) => updateField('doors', e.target.value as string)}
            >
              {doorsOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="seats-label">Seats</InputLabel>
            <Select
              labelId="seats-label"
              value={state.form.seats || ''}
              label="Seats"
              onChange={(e) => updateField('seats', e.target.value as string)}
            >
              {seatsOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="color-label">Color</InputLabel>
            <Select
              labelId="color-label"
              value={state.form.color || ''}
              label="Color"
              onChange={(e) => updateField('color', e.target.value as string)}
            >
              {colorOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="interior-label">Interior</InputLabel>
            <Select
              labelId="interior-label"
              value={state.form.interior || ''}
              label="Interior"
              onChange={(e) =>
                updateField('interior', e.target.value as string)
              }
            >
              {interiorOptions.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>

        <FormGroup>
          <FormControl fullWidth>
            <InputLabel id="firstReg-label">First Registration</InputLabel>
            <Select
              labelId="firstReg-label"
              value={state.form.firstRegistration || ''}
              label="First Registration"
              onChange={(e) =>
                updateField('firstRegistration', e.target.value as string)
              }
            >
              <MenuItem value="">Any</MenuItem>
              {getRegistrationYears().map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>
        <FormTitle>Equipment & Condition</FormTitle>
        <FormGroup>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={state.form.equipment || []}
            onChange={(_, value) => updateField('equipment', value)}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Equipment"
                placeholder="Add equipment and press Enter"
                fullWidth
              />
            )}
          />
        </FormGroup>

        <FormGroup>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={state.form.condition || []}
            onChange={(_, value) => updateField('condition', value)}
            renderTags={(value: string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Condition"
                placeholder="Add condition tags and press Enter"
                fullWidth
              />
            )}
          />
        </FormGroup>

        <FormGroup>
          <PhotosContainer>
            {state.form.photos.map((photo, index) => (
              <PhotoPreview key={index}>
                <PhotoImage src={photo} alt={`Photo ${index + 1}`} />
                <RemovePhotoButton
                  type="button"
                  onClick={() => removePhoto(index)}
                >
                  ×
                </RemovePhotoButton>
              </PhotoPreview>
            ))}
            <UploadButton>
              <AddPhotoAlternateIcon />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
              />
            </UploadButton>
          </PhotosContainer>
        </FormGroup>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={state.loading}
          sx={{ mt: 2 }}
        >
          {state.loading ? <CircularProgress size={24} /> : 'Create Listing'}
        </Button>
      </form>
    </Container>
  )
}
