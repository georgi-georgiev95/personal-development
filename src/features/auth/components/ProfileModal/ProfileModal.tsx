import React, { useState, useCallback } from 'react'
import { useAuth } from '@/features/auth/components/useAuth'
import { getUserProfile, updateUserProfile } from '@/entities/user'
import type { UserProfile } from '@/entities/user'
import { Modal, Button } from '@/shared/ui-kit'
import {
  AvatarBadge,
  FieldGrid,
  FieldGroup,
  FooterHint,
  HeaderBlock,
  HeaderCopy,
  HelperText,
  Label,
  Input,
  ProfileField,
  ProfileSubtext,
  Section,
  StatusText,
  TriggerButton,
} from './ProfileModal.styles'

const TRIGGER_LABEL = 'Open profile settings'

const emptyProfile = {
  firstName: '',
  lastName: '',
  username: '',
  age: null as number | null,
}

type ProfileFormSnapshot = {
  firstName: string
  lastName: string
  username: string
  age: string
}

const emptySnapshot: ProfileFormSnapshot = {
  firstName: '',
  lastName: '',
  username: '',
  age: '',
}

const ProfileModal: React.FC = () => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [age, setAge] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialSnapshot, setInitialSnapshot] =
    useState<ProfileFormSnapshot>(emptySnapshot)
  const [errorMessage, setErrorMessage] = useState('')

  const makeSnapshot = useCallback(
    (
      nextFirstName: string,
      nextLastName: string,
      nextUsername: string,
      nextAge: string
    ) => ({
      firstName: nextFirstName.trim(),
      lastName: nextLastName.trim(),
      username: nextUsername.trim(),
      age: nextAge.trim(),
    }),
    []
  )

  const applyProfile = useCallback(
    (data: UserProfile | null) => {
      setProfile(data)
      if (data) {
        const nextFirstName = data.firstName ?? ''
        const nextLastName = data.lastName ?? ''
        const nextUsername = data.username ?? ''
        const nextAge = data.age != null ? String(data.age) : ''
        setFirstName(nextFirstName)
        setLastName(nextLastName)
        setUsername(nextUsername)
        setAge(nextAge)
        setInitialSnapshot(
          makeSnapshot(nextFirstName, nextLastName, nextUsername, nextAge)
        )
      } else {
        const nextFirstName = emptyProfile.firstName
        const nextLastName = emptyProfile.lastName
        const nextUsername = emptyProfile.username
        const nextAge = emptyProfile.age != null ? String(emptyProfile.age) : ''
        setFirstName(nextFirstName)
        setLastName(nextLastName)
        setUsername(nextUsername)
        setAge(nextAge)
        setInitialSnapshot(
          makeSnapshot(nextFirstName, nextLastName, nextUsername, nextAge)
        )
      }
    },
    [makeSnapshot]
  )

  const handleOpen = useCallback(async () => {
    setErrorMessage('')
    if (!user) {
      applyProfile(null)
      setOpen(true)
      return
    }
    setLoading(true)
    try {
      const data = await getUserProfile(user.uid)
      applyProfile(data)
    } catch (error) {
      console.error('Failed to load profile:', error)
      applyProfile(null)
      setErrorMessage('Could not load profile right now. You can try again.')
    } finally {
      setLoading(false)
      setOpen(true)
    }
  }, [user, applyProfile])

  const handleClose = useCallback(() => {
    setOpen(false)
    setErrorMessage('')
  }, [])

  const handleSave = useCallback(async () => {
    if (!user) return
    setErrorMessage('')
    setSaving(true)
    try {
      await updateUserProfile(user.uid, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        age: age ? Number(age) : null,
      })
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              username: username.trim(),
              age: age ? Number(age) : null,
            }
          : prev
      )
      setInitialSnapshot(makeSnapshot(firstName, lastName, username, age))
      handleClose()
    } catch (error) {
      console.error('Failed to update profile:', error)
      setErrorMessage('Unable to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }, [user, firstName, lastName, username, age, handleClose, makeSnapshot])

  const hasChanges =
    firstName.trim() !== initialSnapshot.firstName ||
    lastName.trim() !== initialSnapshot.lastName ||
    username.trim() !== initialSnapshot.username ||
    age.trim() !== initialSnapshot.age

  const canSave =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    username.trim().length > 0 &&
    hasChanges &&
    !saving

  const displayName =
    [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') ||
    profile?.email ||
    'Profile settings'

  const initials = `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`
    .toUpperCase()
    .trim()
  const avatarText = initials || username.trim().charAt(0).toUpperCase() || 'U'

  return (
    <>
      <TriggerButton
        type="button"
        aria-label={TRIGGER_LABEL}
        onClick={handleOpen}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </TriggerButton>
      <Modal
        open={open}
        onOpenChange={setOpen}
        label="Profile settings"
        className="profile-modal-dialog"
      >
        <Modal.Header>
          <HeaderBlock>
            <AvatarBadge aria-hidden="true">{avatarText}</AvatarBadge>
            <HeaderCopy>
              <ProfileField>{displayName}</ProfileField>
              <ProfileSubtext>
                Keep your public profile details up to date.
              </ProfileSubtext>
            </HeaderCopy>
          </HeaderBlock>
        </Modal.Header>
        <Modal.Content>
          {loading ? (
            <StatusText $variant="info">Loading your profile...</StatusText>
          ) : (
            <Section>
              {errorMessage ? (
                <StatusText $variant="error">{errorMessage}</StatusText>
              ) : null}
              <FieldGrid>
                <FieldGroup>
                  <Label htmlFor="profile-first-name">First name</Label>
                  <Input
                    id="profile-first-name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    disabled={saving}
                  />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor="profile-last-name">Last name</Label>
                  <Input
                    id="profile-last-name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    disabled={saving}
                  />
                </FieldGroup>
              </FieldGrid>
              <FieldGroup>
                <Label htmlFor="profile-username">Username</Label>
                <Input
                  id="profile-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={saving}
                />
              </FieldGroup>
              <FieldGroup>
                <Label htmlFor="profile-age">Age (optional)</Label>
                <Input
                  id="profile-age"
                  type="number"
                  min="0"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  disabled={saving}
                />
                <HelperText>This helps personalize your experience.</HelperText>
              </FieldGroup>
            </Section>
          )}
        </Modal.Content>
        <Modal.Footer>
          <FooterHint>
            {hasChanges ? 'Unsaved changes' : 'All changes saved'}
          </FooterHint>
          <Button variant="secondary" onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!canSave} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export { ProfileModal }
