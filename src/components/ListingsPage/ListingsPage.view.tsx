import React, { useCallback } from 'react'
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { useListingsPageViewModel } from './ListingsPage.viewmodel'
import { useState, useMemo } from 'react'
import {
  Container,
  PageTitle,
  ListingsGrid,
  ListingCard,
  ListingImageContainer,
  PriceBadge,
  ListingImage,
  NoImage,
  ListingContent,
  ListingTitle,
  ListingPrice,
  ListingDescription,
  ListingMeta,
  ListingActions,
  EmptyState,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalActions,
  PhotosContainer,
  PhotoPreview,
  PhotoImage,
  RemovePhotoButton,
  UploadButton,
} from './ListingsPage.styles'
import type { ListingsPageProps } from './ListingsPage.types'
import { useAuth } from '@/components/useAuth'
import { useNavigate } from 'react-router-dom'

export const ListingsPage: React.FC<ListingsPageProps> = () => {
  const { user } = useAuth()
  const {
    state,
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
  } = useListingsPageViewModel(user?.uid || '')
  const navigate = useNavigate()
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  const sortedListings = useMemo(() => {
    const items = [...state.listings]
    items.sort((a, b) =>
      sortOrder === 'asc' ? a.price - b.price : b.price - a.price
    )
    return items
  }, [state.listings, sortOrder])

  const handleEditPhotoUpload = useCallback(
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
          addEditPhoto(reader.result as string)
        }
        reader.readAsDataURL(file)
      })

      e.target.value = ''
    },
    [addEditPhoto]
  )

  const formatDate = (date: Date | null) => {
    if (!date) return 'Unknown'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (state.loading && state.listings.length === 0) {
    return (
      <Container>
        <PageTitle>All Listings</PageTitle>
        <EmptyState>
          <CircularProgress />
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      <PageTitle>All Listings</PageTitle>

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}

      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 12,
          alignItems: 'center',
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setSortOrder((s) => (s === 'desc' ? 'asc' : 'desc'))}
        >
          Sort: Price — {sortOrder === 'desc' ? 'Desc' : 'Asc'}
        </Button>
      </div>

      {sortedListings.length === 0 ? (
        <EmptyState>
          <DirectionsCarIcon sx={{ fontSize: 64, mb: 2 }} />
          <p>No listings yet. Be the first to create one!</p>
        </EmptyState>
      ) : (
        <ListingsGrid>
          {sortedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/listings/${listing.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/listings/${listing.id}`)
              }}
            >
              <ListingImageContainer>
                <PriceBadge>{formatPrice(listing.price)}</PriceBadge>
                {listing.photos.length > 0 ? (
                  <ListingImage src={listing.photos[0]} alt={listing.title} />
                ) : (
                  <NoImage>
                    <DirectionsCarIcon sx={{ fontSize: 64 }} />
                  </NoImage>
                )}
              </ListingImageContainer>
              <ListingContent>
                <ListingTitle>{listing.title}</ListingTitle>
                <ListingPrice>{formatPrice(listing.price)}</ListingPrice>
                <ListingDescription>{listing.description}</ListingDescription>
                <ListingMeta>
                  {user ? (
                    <>
                      Posted by {listing.userEmail} on{' '}
                      {formatDate(listing.createdAt)}
                    </>
                  ) : (
                    <>Posted on {formatDate(listing.createdAt)}</>
                  )}
                </ListingMeta>
                {canEditListing(listing) && (
                  <ListingActions>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        startEditing(listing)
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        confirmDelete(listing.id)
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListingActions>
                )}
              </ListingContent>
            </ListingCard>
          ))}
        </ListingsGrid>
      )}

      {/* Edit Modal */}
      {state.editingId && state.editForm && (
        <ModalOverlay onClick={cancelEditing}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Edit Listing</ModalTitle>
            <TextField
              label="Title"
              fullWidth
              margin="normal"
              value={state.editForm.title}
              onChange={(e) => updateEditField('title', e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={state.editForm.description}
              onChange={(e) => updateEditField('description', e.target.value)}
            />
            <TextField
              label="Price ($)"
              fullWidth
              margin="normal"
              type="number"
              value={state.editForm.price}
              onChange={(e) => updateEditField('price', e.target.value)}
            />
            <PhotosContainer>
              {state.editForm.photos.map((photo, index) => (
                <PhotoPreview key={index}>
                  <PhotoImage src={photo} alt={`Photo ${index + 1}`} />
                  <RemovePhotoButton
                    type="button"
                    onClick={() => removeEditPhoto(index)}
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
                  onChange={handleEditPhotoUpload}
                />
              </UploadButton>
            </PhotosContainer>
            <ModalActions>
              <Button onClick={cancelEditing}>Cancel</Button>
              <Button
                variant="contained"
                onClick={() => void saveEdit()}
                disabled={state.loading}
              >
                Save
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {state.deleteConfirmId && (
        <ModalOverlay onClick={cancelDelete}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Delete Listing</ModalTitle>
            <p>
              Are you sure you want to delete this listing? This action cannot
              be undone.
            </p>
            <ModalActions>
              <Button onClick={cancelDelete}>Cancel</Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => void executeDelete()}
                disabled={state.loading}
              >
                Delete
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}
