import { useMemo, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  DELIVERY_STAGES,
  DeliveryArtifactInputError,
  DeliveryTaskInputError,
  getDeliveryStageBlocker,
  type DeliveryArtifact,
  type DeliveryTask,
  type DeliveryTaskInput,
  type DeliveryStage,
  type DeliveryArtifactStage,
} from '@/entities/delivery-task'
import { Button, Textarea } from '@/shared/ui-kit'
import {
  Actions,
  Breadcrumb,
  Content,
  ArtifactContent,
  ArtifactMeta,
  ArtifactPanel,
  Eyebrow,
  Field,
  FieldError,
  Heading,
  Notice,
  Stage,
  StageActions,
  StageChoice,
  StageProgress,
  TaskCard,
  TaskForm,
  TaskLink,
  TaskList,
  TaskMeta,
  TaskPage,
  TextInput,
} from './TaskWorkspace.styles'

interface TaskListPageProps {
  tasks: DeliveryTask[]
}

interface TaskCreatePageProps {
  onCreate: (input: DeliveryTaskInput) => DeliveryTask
}

interface TaskDetailPageProps {
  task: DeliveryTask | undefined
  onSave: (id: string, input: DeliveryTaskInput) => DeliveryTask | null
  onSaveArtifact: (
    id: string,
    stage: DeliveryArtifactStage,
    content: string
  ) => DeliveryTask | null
  onCompleteStage: (id: string, stage: DeliveryStage) => DeliveryTask | null
  onReopenStage: (id: string, stage: DeliveryStage) => DeliveryTask | null
}

interface TaskDetailRouteProps extends Omit<TaskDetailPageProps, 'task'> {
  tasks: DeliveryTask[]
}

const PageHeading = ({ title }: { title: string }) => (
  <>
    <Eyebrow>// demo workspace</Eyebrow>
    <Heading>{title}</Heading>
    <Notice role="status">
      Demo only: tasks are held in memory and will reset when you reload this
      page. Saved notes stay with their task while you navigate this demo.
    </Notice>
  </>
)

export const TaskListPage = ({ tasks }: TaskListPageProps) => (
  <TaskListContent tasks={tasks} />
)

const TaskListContent = ({ tasks }: TaskListPageProps) => {
  const navigate = useNavigate()
  return (
    <TaskPage>
      <Breadcrumb to="/demo">← Back to walkthrough</Breadcrumb>
      <PageHeading title="Delivery tasks" />
      <Content aria-label="Delivery tasks">
        <Actions>
          <Button onClick={() => navigate('/demo/tasks/new')}>
            Create task
          </Button>
        </Actions>
        {tasks.length === 0 ? (
          <TaskMeta>
            No tasks yet. Create one to start the demo journey.
          </TaskMeta>
        ) : (
          <TaskList>
            {tasks.map((task) => (
              <TaskCard key={task.id}>
                <TaskLink to={`/demo/tasks/${task.id}`}>{task.title}</TaskLink>
                <TaskMeta>{task.goal}</TaskMeta>
                <Stage>Current stage: {task.stage}</Stage>
              </TaskCard>
            ))}
          </TaskList>
        )}
      </Content>
    </TaskPage>
  )
}

export const TaskCreatePage = ({ onCreate }: TaskCreatePageProps) => {
  const navigate = useNavigate()
  const submitting = useRef(false)
  const [title, setTitle] = useState('')
  const [goal, setGoal] = useState('')
  const [error, setError] = useState<DeliveryTaskInputError | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    try {
      const task = onCreate({ title, goal })
      navigate(`/demo/tasks/${task.id}`)
    } catch (caught) {
      submitting.current = false
      if (caught instanceof DeliveryTaskInputError) setError(caught)
      else throw caught
    }
  }

  return (
    <TaskPage>
      <Breadcrumb to="/demo/tasks">← All tasks</Breadcrumb>
      <PageHeading title="Create a delivery task" />
      <Content>
        <TaskForm onSubmit={handleSubmit}>
          <Field>
            <label htmlFor="task-title">Title</label>
            <TextInput
              id="task-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError(null)
              }}
              aria-invalid={error?.field === 'title'}
              aria-describedby={
                error?.field === 'title' ? 'title-error' : undefined
              }
            />
            {error?.field === 'title' && (
              <FieldError id="title-error" role="alert">
                {error.message}
              </FieldError>
            )}
          </Field>
          <Field>
            <label htmlFor="task-goal">Goal</label>
            <Textarea
              id="task-goal"
              value={goal}
              onChange={(event) => {
                setGoal(event.target.value)
                setError(null)
              }}
              aria-invalid={error?.field === 'goal'}
              aria-describedby={
                error?.field === 'goal' ? 'goal-error' : undefined
              }
            />
            {error?.field === 'goal' && (
              <FieldError id="goal-error" role="alert">
                {error.message}
              </FieldError>
            )}
          </Field>
          <Actions>
            <Button type="submit">Create task</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/demo/tasks')}
            >
              Cancel
            </Button>
          </Actions>
        </TaskForm>
      </Content>
    </TaskPage>
  )
}

export const TaskDetailRoute = ({
  tasks,
  onSave,
  onSaveArtifact,
  onCompleteStage,
  onReopenStage,
}: TaskDetailRouteProps) => {
  const { taskId = '' } = useParams()
  const task = useMemo(
    () => tasks.find((item) => item.id === taskId),
    [tasks, taskId]
  )
  return (
    <TaskDetailPage
      key={taskId}
      task={task}
      onSave={onSave}
      onSaveArtifact={onSaveArtifact}
      onCompleteStage={onCompleteStage}
      onReopenStage={onReopenStage}
    />
  )
}

const TaskDetailPage = ({
  task,
  onSave,
  onSaveArtifact,
  onCompleteStage,
  onReopenStage,
}: TaskDetailPageProps) => {
  const navigate = useNavigate()
  const submitting = useRef(false)
  const [title, setTitle] = useState(task?.title ?? '')
  const [goal, setGoal] = useState(task?.goal ?? '')
  const [error, setError] = useState<DeliveryTaskInputError | null>(null)
  const [saved, setSaved] = useState(false)
  const [selectedStage, setSelectedStage] = useState<DeliveryStage>(
    task?.stage ?? 'discovery'
  )

  if (!task) return <UnknownTaskPage />

  const selectStage = (stage: DeliveryStage) => {
    setSelectedStage(stage)
  }

  const updateStage = (update: DeliveryTask | null) => {
    if (update) setSelectedStage(update.stage)
  }
  const currentStageIndex = DELIVERY_STAGES.indexOf(task.stage)
  const selectedStageIndex = DELIVERY_STAGES.indexOf(selectedStage)
  const selectedStageStatus =
    selectedStageIndex < currentStageIndex
      ? 'completed'
      : selectedStageIndex === currentStageIndex
        ? 'current'
        : 'pending'
  const stageBlocker = getDeliveryStageBlocker(selectedStage)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    try {
      const updated = onSave(task.id, { title, goal })
      if (!updated) {
        navigate('/demo/tasks')
        return
      }
      submitting.current = false
      setSelectedStage(updated.stage)
      setSaved(true)
      setError(null)
    } catch (caught) {
      submitting.current = false
      if (caught instanceof DeliveryTaskInputError) setError(caught)
      else throw caught
    }
  }

  return (
    <TaskPage>
      <Breadcrumb to="/demo/tasks">← All tasks</Breadcrumb>
      <PageHeading title={task.title} />
      <Content>
        <Stage>Current stage: {task.stage}</Stage>
        <StageProgress aria-label="Task delivery stages">
          {DELIVERY_STAGES.map((stage) => {
            const stageIndex = DELIVERY_STAGES.indexOf(stage)
            const status =
              stageIndex < currentStageIndex
                ? 'completed'
                : stageIndex === currentStageIndex
                  ? 'current'
                  : 'pending'
            return (
              <li key={stage}>
                <StageChoice
                  type="button"
                  $selected={selectedStage === stage}
                  aria-current={selectedStage === stage ? 'step' : undefined}
                  onClick={() => selectStage(stage)}
                >
                  <span>{stage[0].toUpperCase() + stage.slice(1)}</span>
                  <span>{status}</span>
                </StageChoice>
              </li>
            )
          })}
        </StageProgress>
        <section aria-label={`${selectedStage} stage details`}>
          <Stage>
            {selectedStageStatus} stage: {selectedStage}
          </Stage>
          {selectedStageStatus === 'current' && stageBlocker && (
            <TaskMeta role="note">{stageBlocker}</TaskMeta>
          )}
          {selectedStageStatus === 'pending' && (
            <TaskMeta role="note">Complete earlier stages first.</TaskMeta>
          )}
          <StageActions>
            {selectedStageStatus === 'current' && (
              <Button
                disabled={Boolean(stageBlocker)}
                onClick={() =>
                  updateStage(onCompleteStage(task.id, selectedStage))
                }
              >
                Complete stage
              </Button>
            )}
            {selectedStageStatus === 'completed' && (
              <Button
                variant="secondary"
                onClick={() =>
                  updateStage(onReopenStage(task.id, selectedStage))
                }
              >
                Reopen stage
              </Button>
            )}
          </StageActions>
          {isArtifactStage(selectedStage) ? (
            <StageArtifactEditor
              key={`${task.id}-${selectedStage}`}
              taskId={task.id}
              stage={selectedStage}
              intentRevision={task.intentRevision}
              artifact={task.artifacts[selectedStage]}
              onSave={onSaveArtifact}
            />
          ) : (
            <TaskMeta role="note">
              Notes are available for discovery, planning, implementation, and
              review.
            </TaskMeta>
          )}
        </section>
        <TaskMeta>Created {new Date(task.createdAt).toLocaleString()}</TaskMeta>
        <TaskForm onSubmit={handleSubmit}>
          <Field>
            <label htmlFor="task-title">Title</label>
            <TextInput
              id="task-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError(null)
                setSaved(false)
              }}
              aria-invalid={error?.field === 'title'}
              aria-describedby={
                error?.field === 'title' ? 'title-error' : undefined
              }
            />
            {error?.field === 'title' && (
              <FieldError id="title-error" role="alert">
                {error.message}
              </FieldError>
            )}
          </Field>
          <Field>
            <label htmlFor="task-goal">Goal</label>
            <Textarea
              id="task-goal"
              value={goal}
              onChange={(event) => {
                setGoal(event.target.value)
                setError(null)
                setSaved(false)
              }}
              aria-invalid={error?.field === 'goal'}
              aria-describedby={
                error?.field === 'goal' ? 'goal-error' : undefined
              }
            />
            {error?.field === 'goal' && (
              <FieldError id="goal-error" role="alert">
                {error.message}
              </FieldError>
            )}
          </Field>
          <Actions>
            <Button type="submit">Save changes</Button>
            {saved && <TaskMeta role="status">Task updated.</TaskMeta>}
          </Actions>
        </TaskForm>
      </Content>
    </TaskPage>
  )
}

const ARTIFACT_STAGE_INFO: Partial<
  Record<DeliveryStage, { title: string; label: string }>
> = {
  discovery: { title: 'Discovery notes', label: 'discovery notes' },
  planning: { title: 'Plan', label: 'plan' },
  implementation: {
    title: 'Implementation notes',
    label: 'implementation notes',
  },
  review: { title: 'Review notes', label: 'review notes' },
}

const isArtifactStage = (
  stage: DeliveryStage
): stage is DeliveryArtifactStage => Boolean(ARTIFACT_STAGE_INFO[stage])

interface StageArtifactEditorProps {
  taskId: string
  stage: DeliveryArtifactStage
  intentRevision: number
  artifact: DeliveryArtifact | undefined
  onSave: TaskDetailPageProps['onSaveArtifact']
}

const StageArtifactEditor = ({
  taskId,
  stage,
  intentRevision,
  artifact,
  onSave,
}: StageArtifactEditorProps) => {
  const info = ARTIFACT_STAGE_INFO[stage]!
  const [editing, setEditing] = useState(!artifact)
  const [draft, setDraft] = useState(artifact?.content ?? '')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      if (!onSave(taskId, stage, draft)) return
      setEditing(false)
      setError('')
    } catch (caught) {
      if (caught instanceof DeliveryArtifactInputError) setError(caught.message)
      else throw caught
    }
  }

  const cancel = () => {
    setDraft(artifact?.content ?? '')
    setError('')
    setEditing(false)
  }

  return (
    <ArtifactPanel aria-label={info.title}>
      <h2>{info.title}</h2>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <Field>
            <label htmlFor={`artifact-${taskId}-${stage}`}>{info.title}</label>
            <Textarea
              id={`artifact-${taskId}-${stage}`}
              value={draft}
              rows={8}
              onChange={(event) => {
                setDraft(event.target.value)
                setError('')
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `artifact-error-${stage}` : undefined}
            />
            {error && (
              <FieldError id={`artifact-error-${stage}`} role="alert">
                {error}
              </FieldError>
            )}
          </Field>
          <Actions>
            <Button type="submit">Save {info.label}</Button>
            <Button type="button" variant="secondary" onClick={cancel}>
              Cancel
            </Button>
          </Actions>
        </form>
      ) : (
        <>
          {artifact ? (
            <>
              <ArtifactContent>{artifact.content}</ArtifactContent>
              <ArtifactMeta>
                Revision {artifact.revision} · Source: Manual entry · Created{' '}
                {new Date(artifact.createdAt).toLocaleString()} · Updated{' '}
                {new Date(artifact.updatedAt).toLocaleString()}
              </ArtifactMeta>
              {artifact.taskRevision !== intentRevision && (
                <ArtifactMeta role="status">
                  This note may be stale: the task title or goal changed after
                  it was saved.
                </ArtifactMeta>
              )}
            </>
          ) : (
            <TaskMeta>No {info.label} saved yet.</TaskMeta>
          )}
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setDraft(artifact?.content ?? '')
              setEditing(true)
            }}
          >
            {artifact ? 'Edit' : 'Add notes'}
          </Button>
        </>
      )}
    </ArtifactPanel>
  )
}

export const UnknownTaskPage = () => (
  <TaskPage>
    <Breadcrumb to="/demo/tasks">← All tasks</Breadcrumb>
    <PageHeading title="Task not found" />
    <Content>
      <TaskMeta role="status">
        This task is unavailable in the current demo session. It may have been
        cleared when the page reloaded.
      </TaskMeta>
    </Content>
  </TaskPage>
)
