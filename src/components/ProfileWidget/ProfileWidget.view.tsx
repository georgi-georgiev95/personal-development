import React, { useEffect, useState } from 'react'
import { useViewModel } from '@/core/hooks'
import { TOKENS } from '@/core/di'
import { useAuth } from '@/components/useAuth'
import type { ProfileWidgetVM } from './ProfileWidget.viewmodel'
import type { ProfileWidgetState } from './ProfileWidget.types'
import type { ProfileWidgetProps } from './ProfileWidget.types'
import {
  widgetContainer,
  WidgetTitle,
  InfoRow,
  Label,
  Value,
  Input,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
  ErrorMessage,
} from './ProfileWidget.styles'

export const ProfileWidget: React.FC<ProfileWidgetProps> = ({
  uid: uidProp,
}) => {
  const vm = useViewModel<ProfileWidgetVM>(TOKENS.ProfileWidgetViewModel)
  const { user } = useAuth()
  const [state, setLocalState] = useState<ProfileWidgetState>(vm.getState())

  const uid = uidProp ?? user?.uid

  useEffect(() => {
    const unsubscribe = vm.subscribe(() => {
      setLocalState({ ...vm.getState() })
    })
    if (uid) {
      vm.loadProfile(uid)
    }
    return () => {
      unsubscribe()
      vm.dispose()
    }
  }, [vm, uid])

  const handleSave = (): void => {
    if (uid) {
      vm.saveProfile(uid)
    }
  }

  if (state.loading && !state.profile) {
    return <div className={widgetContainer}>Loading profile…</div>
  }

  return (
    <div className={widgetContainer}>
      <WidgetTitle>Profile</WidgetTitle>

      {state.error && <ErrorMessage>{state.error}</ErrorMessage>}

      <InfoRow>
        <Label>Email</Label>
        <Value>{state.profile?.email ?? user?.email ?? '—'}</Value>
      </InfoRow>

      <InfoRow>
        <Label>Username</Label>
        {state.editing ? (
          <Input
            type="text"
            value={state.displayName}
            onChange={(e) => vm.setDisplayName(e.target.value)}
            aria-label="Username"
          />
        ) : (
          <Value>{state.profile?.username ?? '—'}</Value>
        )}
      </InfoRow>

      <ButtonRow>
        {state.editing ? (
          <>
            <PrimaryButton onClick={handleSave} disabled={state.loading}>
              {state.loading ? 'Saving…' : 'Save'}
            </PrimaryButton>
            <SecondaryButton
              onClick={() => vm.cancelEdit()}
              disabled={state.loading}
            >
              Cancel
            </SecondaryButton>
          </>
        ) : (
          <PrimaryButton onClick={() => vm.startEdit()}>
            Edit Profile
          </PrimaryButton>
        )}
      </ButtonRow>
    </div>
  )
}
