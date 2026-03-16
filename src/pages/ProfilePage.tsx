import React, { useState, useEffect } from 'react'
import { Typography, TextField, IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import NavBar from '../components/NavBar'
import { useAuth } from '../components/AuthProvider'
import { useProfile } from '../components/ProfileProvider'
import { auth } from '../firebase/auth'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import {
  StyledProfileBox,
  StyledProfileCard,
  ProfileHeader,
  ProfilePhotoContainer,
  ProfilePhoto,
  DefaultProfileIcon,
  UploadButton,
  ProfileDetails,
  DetailRow,
  DetailLabel,
  DetailValue,
} from './ProfilePage.styled'
import {
  type UserProfile,
  getUserProfile,
  updateUserProfile,
} from '../services/userService'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const { updatePhotoURL } = useProfile()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const userProfile = await getUserProfile(user.uid)
        setProfile(userProfile)
        setNewUsername(userProfile?.username || '')
        setLoading(false)
      }
    }
    loadProfile()
  }, [user])

  const handleLogout = async () => {
    await signOut(auth)
  }

  const handleClose = () => {
    navigate('/')
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return

    const file = e.target.files[0]

    // Check file size (limit to 1MB for Firestore)
    if (file.size > 1024 * 1024) {
      alert('Image size should be less than 1MB')
      return
    }

    try {
      // Convert image to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        await updateUserProfile(user.uid, { photoURL: base64String })
        setProfile((prev) =>
          prev ? { ...prev, photoURL: base64String } : null
        )
        updatePhotoURL(base64String)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading photo:', error)
    }
  }

  const handleUsernameUpdate = async () => {
    if (!user || !newUsername.trim()) return

    try {
      await updateUserProfile(user.uid, { username: newUsername })
      setProfile((prev) => (prev ? { ...prev, username: newUsername } : null))
      setEditingUsername(false)
    } catch (error) {
      console.error('Error updating username:', error)
    }
  }

  const formatDate = (date: Date | null, includeTime: boolean = false) => {
    if (!date) return 'N/A'
    const dateStr = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    if (includeTime) {
      const timeStr = new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      return `${dateStr} at ${timeStr}`
    }
    return dateStr
  }

  if (loading) {
    return (
      <StyledProfileBox>
        <NavBar onLogout={handleLogout} />
        <Typography variant="h5">Loading...</Typography>
      </StyledProfileBox>
    )
  }

  return (
    <StyledProfileBox>
      <NavBar onLogout={handleLogout} />
      <StyledProfileCard>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1rem',
          }}
        >
          <IconButton onClick={handleClose} size="small" aria-label="Close">
            <CloseIcon />
          </IconButton>
        </div>
        <ProfileHeader>
          <ProfilePhotoContainer>
            {profile?.photoURL ? (
              <ProfilePhoto src={profile.photoURL} alt="Profile" />
            ) : (
              <DefaultProfileIcon>
                <PersonIcon style={{ fontSize: 60, color: 'white' }} />
              </DefaultProfileIcon>
            )}
            <UploadButton htmlFor="photo-upload">
              <PhotoCameraIcon style={{ fontSize: 20 }} />
            </UploadButton>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
          </ProfilePhotoContainer>

          {editingUsername ? (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <TextField
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                size="small"
                autoFocus
              />
              <IconButton color="primary" onClick={handleUsernameUpdate}>
                <SaveIcon />
              </IconButton>
            </div>
          ) : (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Typography variant="h5">
                {profile?.username || 'User'}
              </Typography>
              <IconButton size="small" onClick={() => setEditingUsername(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </div>
          )}

          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
        </ProfileHeader>

        <ProfileDetails>
          <DetailRow>
            <DetailLabel>Account Created:</DetailLabel>
            <DetailValue>{formatDate(profile?.createdAt || null)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Last Login:</DetailLabel>
            <DetailValue>
              {formatDate(profile?.lastLogin || null, true)}
            </DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Posts:</DetailLabel>
            <DetailValue>{profile?.postCount || 0}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Comments:</DetailLabel>
            <DetailValue>{profile?.commentCount || 0}</DetailValue>
          </DetailRow>
        </ProfileDetails>
      </StyledProfileCard>
    </StyledProfileBox>
  )
}

export default ProfilePage
