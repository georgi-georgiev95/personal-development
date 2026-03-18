import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '@/components/NavBar'
import {
  getListing,
  updateListing,
  deleteListing,
  type Listing,
} from '@/services/listingsService'
import {
  Container,
  BackButton,
  PhotoGallery,
  MainPhoto,
  SidePhotos,
  SidePhoto,
  Title,
  Price,
  Description,
  Meta,
  Actions,
  SpecsGrid,
  SpecRow,
  SpecLabel,
  SpecValue,
  LightboxOverlay,
  LightboxImage,
} from './ListingDetailsPage.styled'
import { CircularProgress, Button, TextField } from '@mui/material'
import { useAuth } from '@/components/useAuth'

const ListingDetailsPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [listing, setListing] = useState<Listing | null>(null)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<{
    title: string
    price: string
    description: string
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  type InputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

  useEffect(() => {
    const load = async () => {
      if (!id) return
      setLoading(true)
      try {
        const l = await getListing(id)
        if (!l) {
          setError('Listing not found')
        } else {
          setListing(l)
        }
      } catch {
        setError('Failed to load listing')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [id])

  const handleBack = () => navigate(-1)

  const startEdit = () => {
    if (!listing) return
    setEditForm({
      title: listing.title,
      price: String(listing.price),
      description: listing.description || '',
    })
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditForm(null)
  }

  const saveEdit = async () => {
    if (!listing || !editForm) return
    const price = parseFloat(editForm.price)
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid price')
      return
    }
    setSaving(true)
    try {
      await updateListing(listing.id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        price,
      })
      const updated = await getListing(listing.id)
      setListing(updated)
      setIsEditing(false)
      setEditForm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!listing) return
    const ok = window.confirm(
      'Delete this listing? This action cannot be undone.'
    )
    if (!ok) return
    setDeleting(true)
    try {
      await deleteListing(listing.id)
      navigate('/listings')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <NavBar onLogout={() => void 0} />
        <CircularProgress />
      </Container>
    )
  }

  if (error || !listing) {
    return (
      <Container>
        <NavBar onLogout={() => void 0} />
        <p>{error || 'No listing available'}</p>
        <Button onClick={handleBack}>Back</Button>
      </Container>
    )
  }

  return (
    <Container>
      <NavBar onLogout={() => void 0} />
      <BackButton onClick={handleBack} aria-label="Back">
        ← Back
      </BackButton>

      {isEditing && editForm ? (
        <div>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={editForm.title}
            onChange={(e: InputEvent) =>
              setEditForm({ ...editForm, title: e.target.value })
            }
          />
          <TextField
            label="Price ($)"
            fullWidth
            margin="normal"
            type="number"
            value={editForm.price}
            onChange={(e: InputEvent) =>
              setEditForm({ ...editForm, price: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={editForm.description}
            onChange={(e: InputEvent) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
          />
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={cancelEdit} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => void saveEdit()}
              disabled={saving}
              sx={{ ml: 2 }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Title>{listing?.title}</Title>
          <Price>${listing?.price}</Price>
        </>
      )}

      <PhotoGallery>
        <MainPhoto
          src={listing.photos?.[0]}
          alt={listing.title}
          onClick={() =>
            listing.photos?.[0] && setLightboxSrc(listing.photos[0])
          }
          style={{ cursor: listing.photos?.[0] ? 'zoom-in' : 'default' }}
        />
        <SidePhotos>
          {(listing.photos || []).slice(1, 3).map((p: string, i: number) => (
            <SidePhoto
              key={i}
              src={p}
              alt={`${listing.title} ${i + 2}`}
              onClick={() => setLightboxSrc(p)}
              style={{ cursor: 'zoom-in' }}
            />
          ))}
        </SidePhotos>
      </PhotoGallery>

      {listing.description && <Description>{listing.description}</Description>}

      {/* Structured specs */}
      {listing.specs && Object.keys(listing.specs).length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Key Specifications</h3>
          <SpecsGrid>
            {listing.specs.engine && (
              <SpecRow>
                <SpecLabel>Engine</SpecLabel>
                <SpecValue>{listing.specs.engine}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.mileage && (
              <SpecRow>
                <SpecLabel>Mileage</SpecLabel>
                <SpecValue>{listing.specs.mileage}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.power && (
              <SpecRow>
                <SpecLabel>Power</SpecLabel>
                <SpecValue>{listing.specs.power}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.transmission && (
              <SpecRow>
                <SpecLabel>Transmission</SpecLabel>
                <SpecValue>{listing.specs.transmission}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.driveType && (
              <SpecRow>
                <SpecLabel>Drive Type</SpecLabel>
                <SpecValue>{listing.specs.driveType}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.bodyType && (
              <SpecRow>
                <SpecLabel>Body Type</SpecLabel>
                <SpecValue>{listing.specs.bodyType}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.fuelConsumption && (
              <SpecRow>
                <SpecLabel>Fuel Consumption</SpecLabel>
                <SpecValue>{listing.specs.fuelConsumption}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.euroStandard && (
              <SpecRow>
                <SpecLabel>Euro Standard</SpecLabel>
                <SpecValue>{listing.specs.euroStandard}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.doors && (
              <SpecRow>
                <SpecLabel>Doors</SpecLabel>
                <SpecValue>{listing.specs.doors}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.seats && (
              <SpecRow>
                <SpecLabel>Seats</SpecLabel>
                <SpecValue>{listing.specs.seats}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.color && (
              <SpecRow>
                <SpecLabel>Color</SpecLabel>
                <SpecValue>{listing.specs.color}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.interior && (
              <SpecRow>
                <SpecLabel>Interior</SpecLabel>
                <SpecValue>{listing.specs.interior}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.firstRegistration && (
              <SpecRow>
                <SpecLabel>First Registration</SpecLabel>
                <SpecValue>{listing.specs.firstRegistration}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.equipment && listing.specs.equipment.length > 0 && (
              <SpecRow>
                <SpecLabel>Equipment</SpecLabel>
                <SpecValue>{listing.specs.equipment.join(', ')}</SpecValue>
              </SpecRow>
            )}
            {listing.specs.condition && listing.specs.condition.length > 0 && (
              <SpecRow>
                <SpecLabel>Condition</SpecLabel>
                <SpecValue>{listing.specs.condition.join(', ')}</SpecValue>
              </SpecRow>
            )}
          </SpecsGrid>
        </div>
      )}

      <Meta>
        {user ? (
          <>
            Posted by {listing.userEmail} on{' '}
            {listing.createdAt
              ? new Date(listing.createdAt).toLocaleString()
              : 'Unknown'}
          </>
        ) : (
          <>
            Posted on{' '}
            {listing.createdAt
              ? new Date(listing.createdAt).toLocaleString()
              : 'Unknown'}
          </>
        )}
      </Meta>

      <Actions>
        {user && user.uid === listing.userId && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={startEdit}
              disabled={saving}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={deleting}
              sx={{ ml: 1 }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        )}
        <Button onClick={handleBack}>Close</Button>
      </Actions>
      {lightboxSrc && (
        <LightboxOverlay onClick={() => setLightboxSrc(null)}>
          <LightboxImage src={lightboxSrc} alt="Photo" />
        </LightboxOverlay>
      )}
    </Container>
  )
}

export default ListingDetailsPage
