import { useEffect, useState } from 'react'
import { Button } from '@/shared/ui-kit'
import { PageSpinner } from '@/shared/components/PageSpinner'
import { useAuth } from '@/features/auth/components/useAuth'
import { ensurePersonalWorkspace } from '@/entities/workspace'
import {
  Eyebrow,
  Heading,
  Message,
  WorkspaceLink,
  WorkspacePage,
} from './PersonalWorkspacePage.styles'

function SignedOutWorkspace() {
  return (
    <WorkspacePage aria-labelledby="workspace-heading">
      <Eyebrow>// personal workspace</Eyebrow>
      <Heading id="workspace-heading">Sign in to continue</Heading>
      <Message>Your workspace is private to your account.</Message>
      <WorkspaceLink to="/login">Sign in</WorkspaceLink>
      <WorkspaceLink to="/register">Create an account</WorkspaceLink>
    </WorkspacePage>
  )
}

function OwnedWorkspace({ uid }: { uid: string }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true

    void ensurePersonalWorkspace(uid).then(
      () => {
        if (active) setState('ready')
      },
      () => {
        if (active) setState('error')
      }
    )

    return () => {
      active = false
    }
  }, [uid, attempt])

  if (state === 'loading') return <PageSpinner />

  return (
    <WorkspacePage aria-labelledby="workspace-heading">
      <Eyebrow>// private workspace</Eyebrow>
      <Heading id="workspace-heading">Your personal workspace</Heading>
      {state === 'ready' ? (
        <Message role="status">
          Your private workspace is ready. The public demo remains separate.
        </Message>
      ) : (
        <>
          <Message role="alert">
            We could not load your workspace. Check your connection and try
            again.
          </Message>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setState('loading')
              setAttempt((value) => value + 1)
            }}
          >
            Retry
          </Button>
        </>
      )}
    </WorkspacePage>
  )
}

export function PersonalWorkspacePage() {
  const { user, loading } = useAuth()

  if (loading) return <PageSpinner />
  if (!user) return <SignedOutWorkspace />

  return <OwnedWorkspace key={user.uid} uid={user.uid} />
}

export default PersonalWorkspacePage
