import { useMemo, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  DELIVERY_STAGES,
  DELIVERY_REVIEW_RETURN_STAGES,
  DeliveryArtifactInputError,
  DeliveryTaskInputError,
  getDeliveryStageBlocker,
  type DeliveryArtifact,
  type DeliveryTask,
  type DeliveryTaskInput,
  type DeliveryStage,
  type DeliveryArtifactStage,
  type DeliveryValidationCheck,
  type DeliveryValidationCheckId,
  type DeliveryValidationSource,
  type DeliveryValidationStatus,
  type DeliveryReviewInput,
  type DeliveryReviewReturnStage,
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
  ValidationSelect,
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
  onSaveValidationResult: (
    id: string,
    checkId: DeliveryValidationCheckId,
    status: DeliveryValidationStatus,
    note: string,
    source: Exclude<DeliveryValidationSource, 'demo'> | null
  ) => DeliveryTask | null
  onCompleteStage: (id: string, stage: DeliveryStage) => DeliveryTask | null
  onReview: (id: string, input: DeliveryReviewInput) => DeliveryTask | null
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
  onSaveValidationResult,
  onReview,
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
      onSaveValidationResult={onSaveValidationResult}
      onReview={onReview}
      onCompleteStage={onCompleteStage}
      onReopenStage={onReopenStage}
    />
  )
}

const TaskDetailPage = ({
  task,
  onSave,
  onSaveArtifact,
  onSaveValidationResult,
  onReview,
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
  const stageBlocker = getDeliveryStageBlocker(task, selectedStage)

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
        {task.stage === 'handoff' &&
          !getDeliveryStageBlocker(task, 'review') && (
            <TaskMeta role="status">Ready for handoff.</TaskMeta>
          )}
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
        <ReviewDecisions
          key={task.id + task.reviewDecisions.length}
          task={task}
          editable={task.stage === 'review' && selectedStage === 'review'}
          onReview={(input) => updateStage(onReview(task.id, input))}
        />
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
            {selectedStageStatus === 'current' &&
              selectedStage !== 'review' && (
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
          ) : selectedStage === 'validation' ? (
            <ValidationResults
              checks={task.validationChecks}
              taskId={task.id}
              taskRevision={task.revision}
              workRevision={task.workRevision}
              editable={selectedStageStatus === 'current'}
              onSave={onSaveValidationResult}
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

interface ReviewDecisionsProps {
  task: DeliveryTask
  editable: boolean
  onReview: (input: DeliveryReviewInput) => void
}

function ReviewDecisions({ task, editable, onReview }: ReviewDecisionsProps) {
  const [reason, setReason] = useState('')
  const [returnStage, setReturnStage] =
    useState<DeliveryReviewReturnStage>('implementation')
  const [error, setError] = useState('')
  const latest = task.reviewDecisions.at(-1)
  const validationBlocker = getDeliveryStageBlocker(task, 'validation')
  const reviewer = {
    id: 'demo-reviewer',
    name: 'Demo reviewer',
    source: 'simulated' as const,
  }
  const decide = (input: DeliveryReviewInput) => {
    try {
      onReview(input)
      setError('')
    } catch (caught) {
      if (caught instanceof Error) setError(caught.message)
      else throw caught
    }
  }
  const decisionText = (decision: DeliveryTask['reviewDecisions'][number]) =>
    `${decision.decision === 'approved' ? 'Approved' : `Changes requested: ${decision.reason} · Return to ${decision.returnStage}`} · ${decision.reviewer.name} (${decision.reviewer.source === 'simulated' ? 'simulated reviewer' : 'signed-in owner; self-review'}) · ${new Date(decision.recordedAt).toLocaleString()} · Task revision ${decision.taskRevision}${decision.taskRevision !== task.revision ? ' · Stale — review again' : ''}`

  return (
    <ArtifactPanel aria-label="Review decision">
      <h2>Review decision</h2>
      <ArtifactMeta>
        Demo reviewer is simulated. Personal-workspace review will use the
        signed-in owner; it is self-review, with no independent review claim.
      </ArtifactMeta>
      <ArtifactContent role="status">
        {latest ? decisionText(latest) : 'No review decision yet.'}
      </ArtifactContent>
      {task.reviewDecisions.length > 1 && (
        <details>
          <summary>
            Decision history ({task.reviewDecisions.length - 1} prior)
          </summary>
          <TaskList>
            {task.reviewDecisions
              .slice(0, -1)
              .reverse()
              .map((decision, index) => (
                <TaskCard key={index}>
                  <ArtifactContent>{decisionText(decision)}</ArtifactContent>
                </TaskCard>
              ))}
          </TaskList>
        </details>
      )}
      {editable && (
        <TaskForm
          onSubmit={(event) => {
            event.preventDefault()
            decide({
              decision: 'changes-requested',
              reviewer,
              reason,
              returnStage,
            })
          }}
        >
          {validationBlocker && (
            <TaskMeta role="note">{validationBlocker}</TaskMeta>
          )}
          <Field>
            <label htmlFor="review-reason">
              Reason for requested changes (required)
            </label>
            <Textarea
              id="review-reason"
              value={reason}
              onChange={(event) => {
                setReason(event.target.value)
                setError('')
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'review-error' : undefined}
            />
          </Field>
          <Field>
            <label htmlFor="review-return-stage">Return changes to</label>
            <ValidationSelect
              id="review-return-stage"
              value={returnStage}
              onChange={(event) =>
                setReturnStage(event.target.value as DeliveryReviewReturnStage)
              }
            >
              {DELIVERY_REVIEW_RETURN_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </ValidationSelect>
          </Field>
          {error && (
            <FieldError id="review-error" role="alert">
              {error}
            </FieldError>
          )}
          <Actions>
            <Button
              type="button"
              disabled={Boolean(validationBlocker)}
              onClick={() => decide({ decision: 'approved', reviewer })}
            >
              Approve review
            </Button>
            <Button type="submit" variant="secondary">
              Request changes
            </Button>
          </Actions>
        </TaskForm>
      )}
    </ArtifactPanel>
  )
}

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

interface ValidationResultsProps {
  checks: DeliveryValidationCheck[]
  taskId: string
  taskRevision: number
  workRevision: number
  editable: boolean
  onSave: TaskDetailPageProps['onSaveValidationResult']
}

function ValidationResults({
  checks,
  taskId,
  taskRevision,
  workRevision,
  editable,
  onSave,
}: ValidationResultsProps) {
  const required = checks.filter((check) => check.required)
  const passed = required.filter(
    (check) =>
      check.status === 'passed' &&
      check.evidence?.workRevision === workRevision &&
      check.evidence.source !== 'demo' &&
      Boolean(check.evidence.note.trim())
  ).length

  return (
    <ArtifactPanel aria-label="Validation results">
      <h2>Required checks</h2>
      <ArtifactMeta>
        {required.length === 0
          ? 'No required checks are configured; review may proceed.'
          : `${passed} of ${required.length} required checks pass for task revision ${taskRevision} (work revision ${workRevision}). Results are manually reported; no checks run here.`}
      </ArtifactMeta>
      <TaskList>
        {checks.map((check) => (
          <TaskCard key={`${check.id}-${check.revision}`}>
            <ValidationCheckEditor
              check={check}
              taskId={taskId}
              workRevision={workRevision}
              editable={editable}
              onSave={onSave}
            />
          </TaskCard>
        ))}
      </TaskList>
    </ArtifactPanel>
  )
}

interface ValidationCheckEditorProps {
  check: DeliveryValidationCheck
  taskId: string
  workRevision: number
  editable: boolean
  onSave: ValidationResultsProps['onSave']
}

function ValidationCheckEditor({
  check,
  taskId,
  workRevision,
  editable,
  onSave,
}: ValidationCheckEditorProps) {
  const [status, setStatus] = useState<DeliveryValidationStatus>(check.status)
  const [note, setNote] = useState(check.evidence?.note ?? '')
  const [source, setSource] = useState<'manual' | 'ci'>(
    check.evidence?.source === 'ci' ? 'ci' : 'manual'
  )
  const [error, setError] = useState('')
  const stale = Boolean(
    check.evidence && check.evidence.workRevision !== workRevision
  )
  const label =
    check.evidence?.source === 'demo'
      ? 'Simulated demo · cannot satisfy review'
      : stale
        ? 'Stale'
        : check.status === 'pending'
          ? 'Not run'
          : check.status === 'passed'
            ? check.evidence?.source === 'ci'
              ? 'Passed · manually reported from CI'
              : 'Passed · manually reported'
            : check.status === 'failed'
              ? check.evidence?.source === 'ci'
                ? 'Failed · manually reported from CI'
                : 'Failed · manually reported'
              : check.status

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      onSave(
        taskId,
        check.id,
        status,
        note,
        status === 'pending' ? null : source
      )
      setError('')
    } catch (caught) {
      if (caught instanceof Error) setError(caught.message)
      else throw caught
    }
  }

  return (
    <>
      <Stage>
        {check.name}
        {check.required ? ' · required' : ' · optional'}
      </Stage>
      <ArtifactMeta role={stale ? 'alert' : undefined}>
        {stale
          ? `${check.evidence?.source === 'demo' ? 'Simulated demo evidence · ' : 'Stale: '}evidence is for work revision ${check.evidence?.workRevision}; current work revision is ${workRevision}.`
          : label}
      </ArtifactMeta>
      {check.evidence && !stale && (
        <ArtifactMeta>
          {check.evidence.note || 'No note or URL provided'} · recorded{' '}
          {new Date(check.evidence.recordedAt).toLocaleString()} · evidence
          revision {check.evidence.revision} · task revision{' '}
          {check.evidence.taskRevision}
          {check.history.length > 0 &&
            ` · ${check.history.length} prior result(s)`}
        </ArtifactMeta>
      )}
      {editable ? (
        <TaskForm onSubmit={handleSubmit}>
          <Field>
            <label htmlFor={`check-status-${check.id}`}>
              Result for {check.name}
            </label>
            <ValidationSelect
              id={`check-status-${check.id}`}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as DeliveryValidationStatus)
                setError('')
              }}
            >
              <option value="pending">Not run</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </ValidationSelect>
          </Field>
          {status !== 'pending' && (
            <>
              <Field>
                <label htmlFor={`check-source-${check.id}`}>
                  Evidence source for {check.name}
                </label>
                <ValidationSelect
                  id={`check-source-${check.id}`}
                  value={source}
                  onChange={(event) =>
                    setSource(event.target.value as 'manual' | 'ci')
                  }
                >
                  <option value="manual">Manual</option>
                  <option value="ci">CI copied manually</option>
                </ValidationSelect>
              </Field>
              <Field>
                <label htmlFor={`check-evidence-${check.id}`}>
                  Evidence note or URL for {check.name}{' '}
                  {status === 'passed' ? '(required)' : '(optional)'}
                </label>
                <TextInput
                  id={`check-evidence-${check.id}`}
                  value={note}
                  onChange={(event) => {
                    setNote(event.target.value)
                    setError('')
                  }}
                />
              </Field>
            </>
          )}
          {error && <FieldError role="alert">{error}</FieldError>}
          <Actions>
            <Button type="submit">Save {check.name} result</Button>
          </Actions>
        </TaskForm>
      ) : (
        <ArtifactMeta>
          Results can only be edited during the validation stage.
        </ArtifactMeta>
      )}
    </>
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
