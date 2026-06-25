import React, { useState, useCallback } from 'react'
import { useAuth } from '@/features/auth/components/useAuth'
import { getUserProfile, updateUserProfile } from '@/entities/user'
import type { UserProfile } from '@/entities/user'
import { Modal, Button } from '@/shared/ui-kit'
import {
  Label,
  Input,
  ProfileField,
  TriggerButton,
} from './ProfileModal.styles'

const TRIGGER_LABEL = 'Open profile settings'

const emptyProfile = {
  firstName: '',
  lastName: '',
  username: '',
  age: null as number | null,
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

  const applyProfile = useCallback((data: UserProfile | null) => {
    setProfile(data)
    if (data) {
      setFirstName(data.firstName)
      setLastName(data.lastName)
      setUsername(data.username)
      setAge(data.age != null ? String(data.age) : '')
    } else {
      setFirstName(emptyProfile.firstName)
      setLastName(emptyProfile.lastName)
      setUsername(emptyProfile.username)
      setAge(emptyProfile.age != null ? String(emptyProfile.age) : '')
    }
  }, [])

  const handleOpen = useCallback(async () => {
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
    } finally {
      setLoading(false)
      setOpen(true)
    }
  }, [user, applyProfile])

  const handleClose = useCallback(() => setOpen(false), [])

  const handleSave = useCallback(async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateUserProfile(user.uid, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        age: age ? Number(age) : null,
      })
      handleClose()
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setSaving(false)
    }
  }, [user, firstName, lastName, username, age, handleClose])

  const hasChanges =
    profile !== null &&
    (firstName.trim() !== (profile.firstName ?? '') ||
      lastName.trim() !== (profile.lastName ?? '') ||
      username.trim() !== (profile.username ?? '') ||
      (age ? Number(age) : null) !== (profile.age ?? null))

  const canSave =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    username.trim().length > 0 &&
    hasChanges &&
    !saving

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
      <Modal open={open} onOpenChange={setOpen} label="Profile settings">
        <Modal.Header>
          <ProfileField>{firstName || 'Set your name'}</ProfileField>
        </Modal.Header>
        <Modal.Content>
          {loading ? (
            <p style={{ margin: 0 }}>Loading…</p>
          ) : (
            <>
              <Label htmlFor="profile-first-name">First name</Label>
              <Input
                id="profile-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
              <Label htmlFor="profile-last-name">Last name</Label>
              <Input
                id="profile-last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
              <Label htmlFor="profile-username">Username</Label>
              <Input
                id="profile-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
              <Label htmlFor="profile-age">Age</Label>
              <Input
                id="profile-age"
                type="number"
                min="0"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
              />
            </>
          )}
        </Modal.Content>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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
