import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Button } from '@/shared/ui-kit'
import { PageSpinner } from '@/shared/components/PageSpinner'
import { useAuth } from '@/features/auth/components/useAuth'
import {
  completeDeliveryTaskStage,
  reopenDeliveryTaskStage,
  recordDeliveryReviewDecision,
  recordDeliveryValidationResult,
  saveDeliveryArtifact,
  updateDeliveryTask,
  type DeliveryArtifactStage,
  type DeliveryReviewInput,
  type DeliveryStage,
  type DeliveryTask,
  type DeliveryTaskInput,
  type DeliveryValidationCheckId,
  type DeliveryValidationSource,
  type DeliveryValidationStatus,
} from '@/entities/delivery-task'
import {
  listWorkspaceDeliveryTasks,
  saveWorkspaceDeliveryTask,
} from '@/entities/delivery-task/deliveryTaskRepository'
import { ensurePersonalWorkspace } from '@/entities/workspace'
import {
  TaskCreatePage,
  TaskDetailRoute,
  TaskListPage,
  UnknownTaskPage,
} from '@/features/ai-delivery-lab/pages/TaskWorkspace'
import {
  Eyebrow,
  Heading,
  Message,
  WorkspaceLink,
  WorkspacePage,
} from './PersonalWorkspacePage.styles'

const BASE_PATH = '/workspace'

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

function OwnedWorkspace({
  uid,
  reviewerName,
}: {
  uid: string
  reviewerName: string
}) {
  const [tasks, setTasks] = useState<DeliveryTask[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    void (async () => {
      try {
        await ensurePersonalWorkspace(uid)
        const savedTasks = await listWorkspaceDeliveryTasks(uid)
        if (active) {
          setTasks(savedTasks)
          setState('ready')
        }
      } catch {
        if (active) setState('error')
      }
    })()

    return () => {
      active = false
    }
  }, [uid, attempt])

  const createTask = async (task: DeliveryTask) => {
    await saveWorkspaceDeliveryTask(uid, task)
    setTasks((current) => [
      task,
      ...current.filter((item) => item.id !== task.id),
    ])
    return task
  }

  const saveTask = async (
    id: string,
    input: DeliveryTaskInput
  ): Promise<DeliveryTask | null> => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return null
    const updated = updateDeliveryTask(task, input)
    await saveWorkspaceDeliveryTask(uid, updated)
    setTasks((current) =>
      current.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }

  const updateTask = async (
    id: string,
    transform: (task: DeliveryTask) => DeliveryTask
  ): Promise<DeliveryTask | null> => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return null
    const updated = transform(task)
    await saveWorkspaceDeliveryTask(uid, updated)
    setTasks((current) =>
      current.map((item) => (item.id === id ? updated : item))
    )
    return updated
  }

  const saveArtifact = (
    id: string,
    stage: DeliveryArtifactStage,
    content: string
  ) => updateTask(id, (task) => saveDeliveryArtifact(task, stage, content))

  const saveValidationResult = (
    id: string,
    checkId: DeliveryValidationCheckId,
    status: DeliveryValidationStatus,
    note: string,
    source: Exclude<DeliveryValidationSource, 'demo'> | null
  ) =>
    updateTask(id, (task) =>
      recordDeliveryValidationResult(task, checkId, status, note, source)
    )

  const completeStage = (id: string, stage: DeliveryStage) =>
    updateTask(id, (task) => completeDeliveryTaskStage(task, stage))

  const reviewTask = (id: string, input: DeliveryReviewInput) =>
    updateTask(id, (task) => recordDeliveryReviewDecision(task, input))

  const reopenStage = (id: string, stage: DeliveryStage) =>
    updateTask(id, (task) => reopenDeliveryTaskStage(task, stage))

  if (state === 'loading') return <PageSpinner />

  if (state === 'error') {
    return (
      <WorkspacePage aria-labelledby="workspace-heading">
        <Eyebrow>// private workspace</Eyebrow>
        <Heading id="workspace-heading">Your personal workspace</Heading>
        <Message role="alert">
          We could not load your workspace. Check your connection and try again.
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
      </WorkspacePage>
    )
  }

  return (
    <Routes>
      <Route
        index
        element={<TaskListPage tasks={tasks} basePath={BASE_PATH} />}
      />
      <Route
        path="tasks"
        element={<TaskListPage tasks={tasks} basePath={BASE_PATH} />}
      />
      <Route
        path="tasks/new"
        element={<TaskCreatePage onCreate={createTask} basePath={BASE_PATH} />}
      />
      <Route
        path="tasks/:taskId"
        element={
          <TaskDetailRoute
            tasks={tasks}
            basePath={BASE_PATH}
            reviewer={{ id: uid, name: reviewerName, source: 'owner' }}
            onSave={saveTask}
            onSaveArtifact={saveArtifact}
            onSaveValidationResult={saveValidationResult}
            onReview={reviewTask}
            onCompleteStage={completeStage}
            onReopenStage={reopenStage}
          />
        }
      />
      <Route path="*" element={<UnknownTaskPage basePath={BASE_PATH} />} />
    </Routes>
  )
}

export function PersonalWorkspacePage() {
  const { user, loading } = useAuth()

  if (loading) return <PageSpinner />
  if (!user) return <SignedOutWorkspace />

  return (
    <OwnedWorkspace
      key={user.uid}
      uid={user.uid}
      reviewerName={user.displayName || user.email || 'Workspace owner'}
    />
  )
}

export default PersonalWorkspacePage
