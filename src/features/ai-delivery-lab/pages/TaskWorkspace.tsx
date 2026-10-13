import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { DemoJourney } from '@/features/ai-delivery-lab/demoJourneys'
import { PlanDraftEditor } from '@/features/ai-delivery-lab/pages/PlanDraftEditor'
import {
  DELIVERY_STAGES,
  ARTIFACT_SOURCE_LABELS,
  acceptDeliveryPlan,
  type DeliveryPlanProposal,
  DELIVERY_REVIEW_RETURN_STAGES,
  DeliveryArtifactInputError,
  DeliveryTaskConflictError,
  DeliveryTaskInputError,
  getDeliveryStageBlocker,
  createDeliveryTask,
  deriveDeliveryTaskTitle,
  updateDeliveryTask,
  createDeliveryHandoff,
  type DeliveryArtifact,
  type DeliveryTask,
  type DeliveryTaskInput,
  type DeliveryReviewer,
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
  PlanPanel,
  PlanDocument,
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
  HandoffPreview,
} from './TaskWorkspace.styles'

interface TaskListPageProps {
  tasks: DeliveryTask[]
  onCreateSample?: (journey: DemoJourney) => DeliveryTask
  basePath?: string
}

interface TaskCreatePageProps {
  onCreate: (task: DeliveryTask) => DeliveryTask | Promise<DeliveryTask>
  basePath?: string
}

interface TaskPlanPageProps {
  onCreate: (task: DeliveryTask) => DeliveryTask | Promise<DeliveryTask>
  onUpdate: (task: DeliveryTask) => DeliveryTask | Promise<DeliveryTask>
  basePath?: string
}

type TaskWrite<T> = T | Promise<T>

interface TaskDetailPageProps {
  task: DeliveryTask | undefined
  basePath?: string
  reviewer?: DeliveryReviewer
  onSave: (
    id: string,
    input: DeliveryTaskInput
  ) => TaskWrite<DeliveryTask | null>
  onSaveArtifact: (
    id: string,
    stage: DeliveryArtifactStage,
    content: string
  ) => TaskWrite<DeliveryTask | null>
  onSaveValidationResult: (
    id: string,
    checkId: DeliveryValidationCheckId,
    status: DeliveryValidationStatus,
    note: string,
    source: Exclude<DeliveryValidationSource, 'demo'> | null
  ) => TaskWrite<DeliveryTask | null>
  onCompleteStage: (
    id: string,
    stage: DeliveryStage
  ) => TaskWrite<DeliveryTask | null>
  onReview: (
    id: string,
    input: DeliveryReviewInput
  ) => TaskWrite<DeliveryTask | null>
  onReopenStage: (
    id: string,
    stage: DeliveryStage
  ) => TaskWrite<DeliveryTask | null>
  onAcceptPlan?: (
    id: string,
    draft: DeliveryPlanProposal
  ) => TaskWrite<DeliveryTask | null>
}

interface TaskDetailRouteProps extends Omit<TaskDetailPageProps, 'task'> {
  tasks: DeliveryTask[]
  basePath?: string
  reviewer?: DeliveryReviewer
}

const PageHeading = ({
  title,
  basePath = '/demo',
}: {
  title: string
  basePath?: string
}) => (
  <>
    <Eyebrow>
      // {basePath === '/demo' ? 'demo workspace' : 'private workspace'}
    </Eyebrow>
    <Heading>{title}</Heading>
    <Notice role="status">
      {basePath === '/demo'
        ? 'Simulated demo · no real AI. Plans are temporary and reset on reload.'
        : 'Plans are saved in your private workspace and stay separate from the public demo.'}
    </Notice>
  </>
)

export const TaskListPage = ({
  tasks,
  onCreateSample,
  basePath = '/demo',
}: TaskListPageProps) => (
  <TaskListContent
    tasks={tasks}
    onCreateSample={onCreateSample}
    basePath={basePath}
  />
)

const TaskListContent = ({
  tasks,
  onCreateSample,
  basePath = '/demo',
}: TaskListPageProps) => {
  const navigate = useNavigate()
  return (
    <TaskPage>
      <Breadcrumb to={basePath}>
        {basePath === '/demo' ? '← Try another plan' : '← Workspace'}
      </Breadcrumb>
      <PageHeading title="Saved plans" basePath={basePath} />
      <Content aria-label="Saved plans">
        <Actions>
          <Button onClick={() => navigate(`${basePath}/tasks/new`)}>
            New plan
          </Button>
          {onCreateSample &&
            (['successful', 'changes-requested'] as const).map((journey) => (
              <Button
                key={journey}
                variant="secondary"
                onClick={() =>
                  navigate(`${basePath}/tasks/${onCreateSample(journey).id}`)
                }
              >
                Load {journey} journey template
              </Button>
            ))}
        </Actions>
        <TaskMeta>
          {onCreateSample
            ? 'Samples contain placeholder notes and no passing evidence. Complete the successful path with real manual evidence and approval; the changes-requested sample has a simulated review decision.'
            : basePath === '/demo'
              ? 'Plans saved in this demo session disappear on reload.'
              : 'Only you can see your saved plans.'}
        </TaskMeta>
        {tasks.length === 0 ? (
          <TaskMeta>
            {onCreateSample
              ? 'No tasks yet. Create one to start the demo journey.'
              : 'No saved plans yet. Create a plan to save it here.'}
          </TaskMeta>
        ) : (
          <TaskList>
            {tasks.map((task) => (
              <TaskCard key={task.id}>
                <TaskLink to={`${basePath}/tasks/${task.id}`}>
                  {task.title}
                </TaskLink>
                <TaskMeta>{task.goal}</TaskMeta>
                {task.artifacts.planning ? (
                  <TaskMeta>Saved plan</TaskMeta>
                ) : (
                  <TaskMeta>Task input only · no plan saved yet</TaskMeta>
                )}
              </TaskCard>
            ))}
          </TaskList>
        )}
      </Content>
    </TaskPage>
  )
}

export const TaskCreatePage = ({
  onCreate,
  basePath = '/demo',
}: TaskCreatePageProps) => {
  const navigate = useNavigate()
  const submitting = useRef(false)
  const pendingTask = useRef<DeliveryTask | null>(null)
  const [title, setTitle] = useState('')
  const [goal, setGoal] = useState('')
  const [error, setError] = useState<DeliveryTaskInputError | null>(null)
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setSaving(true)
    setError(null)
    setSaveError('')
    try {
      const task = pendingTask.current ?? createDeliveryTask({ title, goal })
      pendingTask.current = task
      const created = await onCreate(task)
      navigate(`${basePath}/tasks/${created.id}`)
    } catch (caught) {
      if (caught instanceof DeliveryTaskInputError) setError(caught)
      else if (caught instanceof DeliveryTaskConflictError)
        setSaveError(caught.message)
      else setSaveError('Could not save this task. Try again.')
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }

  return (
    <TaskPage>
      <Breadcrumb to={`${basePath}/tasks`}>← All tasks</Breadcrumb>
      <PageHeading title="Create a delivery task" basePath={basePath} />
      <Content>
        <TaskForm onSubmit={handleSubmit}>
          {saveError && <FieldError role="alert">{saveError}</FieldError>}
          <Field>
            <label htmlFor="task-title">Title</label>
            <TextInput
              id="task-title"
              placeholder="e.g. Improve onboarding"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError(null)
                setSaveError('')
                pendingTask.current = null
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
              placeholder="Describe the outcome you want to achieve."
              value={goal}
              onChange={(event) => {
                setGoal(event.target.value)
                setError(null)
                setSaveError('')
                pendingTask.current = null
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
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Create task'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`${basePath}/tasks`)}
            >
              Cancel
            </Button>
          </Actions>
        </TaskForm>
      </Content>
    </TaskPage>
  )
}

export function TaskPlanPage({
  onCreate,
  onUpdate,
  basePath = '/workspace',
}: TaskPlanPageProps) {
  const navigate = useNavigate()
  const demo = basePath === '/demo'
  const request = useRef(0)
  useEffect(
    () => () => {
      request.current += 1
    },
    []
  )
  const pendingTask = useRef<DeliveryTask | null>(null)
  const [goal, setGoal] = useState('')
  const [draft, setDraft] = useState<DeliveryPlanProposal | null>(null)
  const [state, setState] = useState<'idle' | 'generating'>('idle')
  const [error, setError] = useState('')
  const [savedInput, setSavedInput] = useState(false)
  const [savedPlan, setSavedPlan] = useState(false)
  const [editingPlan, setEditingPlan] = useState(false)
  const [planStatus, setPlanStatus] = useState('')

  const invalidate = () => {
    request.current += 1
    setDraft(null)
    setEditingPlan(false)
    setError('')
    setState('idle')
    setSavedInput(false)
    setSavedPlan(false)
    setPlanStatus('')
  }

  const generate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const token = ++request.current
    setState('generating')
    setEditingPlan(false)
    setDraft(null)
    setError('')
    setPlanStatus('')

    try {
      const title = deriveDeliveryTaskTitle(goal)
      const current = pendingTask.current
      let task = current
        ? updateDeliveryTask(current, { title, goal })
        : createDeliveryTask({ title, goal })
      if (!current) pendingTask.current = task
      if (task !== current || !task.persistenceRevision)
        task =
          task.persistenceRevision || (demo && current)
            ? await onUpdate(task)
            : await onCreate(task)
      pendingTask.current = task
      if (token === request.current) setSavedInput(true)
      if (token !== request.current) return

      const result = demo
        ? {
            objective: task.goal,
            steps: [
              'Look at what you have and what you can change.',
              'Choose one small, affordable step and try it.',
              'Check whether it helps and decide what to do next.',
            ],
            acceptanceCriteria: [
              'The result improves the situation within your time and budget.',
            ],
            risks: ['Sample plan only; adjust these steps to your situation.'],
            contextRevision: task.contextRevision ?? 0,
          }
        : await (
            await import('@/entities/delivery-task/planService')
          ).generateDeliveryPlan({
            taskId: task.id,
            contextEntryIds: [],
            contextRevision: task.contextRevision ?? 0,
          })
      if (token !== request.current) return
      setDraft({
        ...result,
        taskId: task.id,
        taskRevision: task.revision,
        source: demo ? 'demo' : 'ai',
      })
      setSavedPlan(false)
    } catch (caught) {
      if (token === request.current)
        setError(
          caught instanceof Error
            ? caught.message
            : 'Could not generate a plan. Try again.'
        )
    } finally {
      if (token === request.current) setState('idle')
    }
  }

  const planMarkdown = (proposal: DeliveryPlanProposal): string =>
    [
      `## Objective\n${proposal.objective.trim()}`,
      `## Steps\n${proposal.steps
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `- ${line}`)
        .join('\n')}`,
      `## Acceptance criteria\n${proposal.acceptanceCriteria
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `- ${line}`)
        .join('\n')}`,
      `## Risks\n${
        proposal.risks
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => `- ${line}`)
          .join('\n') || 'None recorded.'
      }`,
    ].join('\n\n')
  const savePlan = async () => {
    if (!draft || !pendingTask.current) return
    setError('')
    setPlanStatus('')
    try {
      const accepted = acceptDeliveryPlan(pendingTask.current, draft)
      const saved = await onUpdate(accepted)
      pendingTask.current = saved
      setDraft({ ...draft, taskRevision: saved.revision })
      setSavedPlan(true)
      setEditingPlan(false)
      setPlanStatus(
        demo
          ? 'Saved for this demo session. Reloading clears it.'
          : 'Saved to your private workspace.'
      )
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Could not save the plan. Try again.'
      )
    }
  }
  const copyPlan = async () => {
    if (!draft) return
    const markdown = planMarkdown(draft)
    try {
      await navigator.clipboard.writeText(markdown)
      setPlanStatus('Copied Markdown to the clipboard.')
    } catch {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(
        new Blob([markdown], { type: 'text/markdown' })
      )
      link.download = 'action-plan.md'
      link.click()
      URL.revokeObjectURL(link.href)
      setPlanStatus(
        'Clipboard unavailable; downloaded the Markdown file instead.'
      )
    }
  }

  return (
    <TaskPage>
      <Breadcrumb to={`${basePath}/tasks`}>← Saved plans</Breadcrumb>
      <PageHeading
        title={demo ? 'Try an idea. See a plan.' : 'Start a plan'}
        basePath={basePath}
      />
      <Content>
        <TaskForm onSubmit={generate}>
          {demo && (
            <Actions>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  invalidate()
                  setGoal('Make my room brighter without spending much.')
                }}
              >
                Use sample idea
              </Button>
            </Actions>
          )}
          <Field>
            <label htmlFor="plan-goal">What do you want to accomplish?</label>
            <Textarea
              id="plan-goal"
              placeholder="For example: plan meals for the week, organize my day, or make my room brighter."
              value={goal}
              rows={4}
              required
              onChange={(event) => {
                setGoal(event.target.value)
                invalidate()
              }}
            />
          </Field>
          {error && <FieldError role="alert">{error}</FieldError>}
          <Actions>
            <Button type="submit" disabled={state === 'generating'}>
              {state === 'generating' ? 'Generating…' : 'Generate plan'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`${basePath}/tasks`)}
            >
              Saved plans
            </Button>
          </Actions>
          {savedInput && (
            <TaskMeta role="status">
              {demo
                ? 'Sample response · no real AI was used.'
                : 'Your task input is saved separately from this generated plan.'}
            </TaskMeta>
          )}
        </TaskForm>
        {draft && (
          <PlanPanel aria-label="Generated plan">
            <h2>Your plan</h2>
            <ArtifactMeta>
              {savedPlan
                ? 'Saved plan. Edit and save again to update it.'
                : 'Draft only. Edit it, then save when it is ready.'}
            </ArtifactMeta>
            {editingPlan ? (
              <>
                {(['objective', 'steps', 'acceptanceCriteria'] as const).map(
                  (field) => (
                    <Field key={field}>
                      <label htmlFor={`plan-${field}`}>
                        {field === 'acceptanceCriteria'
                          ? 'What success looks like'
                          : field === 'objective'
                            ? 'Objective'
                            : 'Steps (one per line)'}
                      </label>
                      <Textarea
                        id={`plan-${field}`}
                        placeholder={
                          field === 'objective'
                            ? 'Summarize the intended outcome.'
                            : 'Add one item per line.'
                        }
                        rows={field === 'objective' ? 3 : 5}
                        value={
                          field === 'objective'
                            ? draft.objective
                            : draft[field].join('\n')
                        }
                        onChange={(event) => {
                          setDraft({
                            ...draft,
                            [field]:
                              field === 'objective'
                                ? event.target.value
                                : event.target.value.split('\n'),
                          })
                          setSavedPlan(false)
                          setPlanStatus('Unsaved changes.')
                        }}
                      />
                    </Field>
                  )
                )}
                <details>
                  <summary>Risks (optional)</summary>
                  <Field>
                    <label htmlFor="plan-risks">Risks (one per line)</label>
                    <Textarea
                      id="plan-risks"
                      placeholder="Add one risk per line, or leave blank."
                      rows={4}
                      value={draft.risks.join('\n')}
                      onChange={(event) => {
                        setDraft({
                          ...draft,
                          risks: event.target.value.split('\n'),
                        })
                        setSavedPlan(false)
                        setPlanStatus('Unsaved changes.')
                      }}
                    />
                  </Field>
                </details>
              </>
            ) : (
              <PlanDocument>
                <section>
                  <h3>Objective</h3>
                  <p>{draft.objective}</p>
                </section>
                <section>
                  <h3>Steps</h3>
                  <ol>
                    {draft.steps
                      .filter((line) => line.trim())
                      .map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                  </ol>
                </section>
                <section>
                  <h3>What success looks like</h3>
                  <ul>
                    {draft.acceptanceCriteria
                      .filter((line) => line.trim())
                      .map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                  </ul>
                </section>
                {draft.risks.some((line) => line.trim()) && (
                  <details>
                    <summary>Risks</summary>
                    <ul>
                      {draft.risks
                        .filter((line) => line.trim())
                        .map((line, index) => (
                          <li key={index}>{line}</li>
                        ))}
                    </ul>
                  </details>
                )}
              </PlanDocument>
            )}
            {planStatus && <TaskMeta role="status">{planStatus}</TaskMeta>}
            <Actions>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingPlan(!editingPlan)}
              >
                {editingPlan ? 'Done editing' : 'Edit plan'}
              </Button>
              <Button type="button" onClick={() => void savePlan()}>
                Save plan
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => void copyPlan()}
              >
                Copy Markdown
              </Button>
            </Actions>
          </PlanPanel>
        )}
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
  onAcceptPlan,
  basePath = '/demo',
  reviewer,
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
      onAcceptPlan={onAcceptPlan}
      basePath={basePath}
      reviewer={reviewer}
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
  onAcceptPlan,
  basePath = '/demo',
  reviewer,
}: TaskDetailPageProps) => {
  const navigate = useNavigate()
  const submitting = useRef(false)
  const [title, setTitle] = useState(task?.title ?? '')
  const [goal, setGoal] = useState(task?.goal ?? '')
  const [error, setError] = useState<DeliveryTaskInputError | null>(null)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const [mutationError, setMutationError] = useState('')
  const [selectedStage, setSelectedStage] = useState<DeliveryStage>(
    task?.stage ?? 'discovery'
  )

  if (!task) return <UnknownTaskPage basePath={basePath} />

  const selectStage = (stage: DeliveryStage) => {
    setSelectedStage(stage)
  }

  const updateStage = (update: DeliveryTask | null) => {
    if (update) setSelectedStage(update.stage)
  }
  const runStageMutation = async (
    operation: () => TaskWrite<DeliveryTask | null>
  ) => {
    setMutationError('')
    try {
      updateStage(await operation())
    } catch (caught) {
      setMutationError(
        caught instanceof DeliveryTaskConflictError
          ? caught.message
          : 'Could not save this change. Try again.'
      )
    }
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setSaving(true)
    setSaveError('')
    try {
      const updated = await onSave(task.id, { title, goal })
      if (!updated) {
        navigate(`${basePath}/tasks`)
        return
      }
      setSelectedStage(updated.stage)
      setSaved(true)
      setError(null)
    } catch (caught) {
      if (caught instanceof DeliveryTaskInputError) setError(caught)
      else if (caught instanceof DeliveryTaskConflictError)
        setSaveError(caught.message)
      else setSaveError('Could not save these changes. Try again.')
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }

  return (
    <TaskPage>
      <Breadcrumb to={`${basePath}/tasks`}>← All tasks</Breadcrumb>
      <PageHeading title={task.title} basePath={basePath} />
      <Content>
        {task.artifacts.planning && (
          <StageArtifactEditor
            key={`${task.id}-plan-${task.artifacts.planning.revision}`}
            taskId={task.id}
            stage="planning"
            intentRevision={task.intentRevision}
            contextRevision={task.contextRevision ?? 0}
            artifact={task.artifacts.planning}
            onSave={onSaveArtifact}
          />
        )}
        <details>
          <summary>Delivery details (optional)</summary>
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
            reviewer={reviewer}
            editable={task.stage === 'review' && selectedStage === 'review'}
            onReview={async (input) => {
              const updated = await onReview(task.id, input)
              updateStage(updated)
              return updated
            }}
          />
          <section aria-label={`${selectedStage} stage details`}>
            {mutationError && (
              <FieldError role="alert">{mutationError}</FieldError>
            )}
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
                selectedStage !== 'review' &&
                selectedStage !== 'handoff' && (
                  <Button
                    disabled={Boolean(stageBlocker)}
                    onClick={() =>
                      void runStageMutation(() =>
                        onCompleteStage(task.id, selectedStage)
                      )
                    }
                  >
                    Complete stage
                  </Button>
                )}
              {selectedStageStatus === 'completed' && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    void runStageMutation(() =>
                      onReopenStage(task.id, selectedStage)
                    )
                  }
                >
                  Reopen stage
                </Button>
              )}
            </StageActions>
            {selectedStage === 'planning' && onAcceptPlan && (
              <PlanDraftEditor
                key={`${task.id}-${task.revision}-${task.contextRevision ?? 0}`}
                task={task}
                demo={basePath === '/demo'}
                onAccept={onAcceptPlan}
              />
            )}
            {selectedStage === 'planning' &&
            task.artifacts.planning ? null : isArtifactStage(selectedStage) ? (
              <StageArtifactEditor
                key={`${task.id}-${selectedStage}-${task.artifacts[selectedStage]?.revision ?? 0}`}
                taskId={task.id}
                stage={selectedStage}
                intentRevision={task.intentRevision}
                contextRevision={task.contextRevision ?? 0}
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
              <HandoffExport task={task} />
            )}
          </section>
          <TaskMeta>
            Created {new Date(task.createdAt).toLocaleString()}
          </TaskMeta>
          <TaskForm onSubmit={handleSubmit}>
            {saveError && <FieldError role="alert">{saveError}</FieldError>}
            <Field>
              <label htmlFor="task-title">Title</label>
              <TextInput
                id="task-title"
                placeholder="e.g. Improve onboarding"
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
                placeholder="Describe the outcome you want to achieve."
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
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
              {saved && <TaskMeta role="status">Task updated.</TaskMeta>}
            </Actions>
          </TaskForm>
        </details>
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

function HandoffExport({ task }: { task: DeliveryTask }) {
  const handoff = createDeliveryHandoff(task)
  const [message, setMessage] = useState('')
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([handoff.markdown], { type: 'text/markdown;charset=utf-8' })
    )
    const link = document.createElement('a')
    link.href = url
    link.download = `delivery-handoff-${task.id}-${handoff.status}.md`
    link.click()
    URL.revokeObjectURL(url)
  }
  return (
    <ArtifactPanel aria-label="Delivery handoff">
      <h2>Delivery handoff</h2>
      <TaskMeta role="status">
        {handoff.status === 'ready'
          ? 'Ready handoff'
          : 'Draft handoff — prerequisites are incomplete.'}
      </TaskMeta>
      <Actions>
        <Button onClick={download}>Download {handoff.status} Markdown</Button>
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(handoff.markdown)
              setMessage('Markdown copied.')
            } catch {
              setMessage('Copy unavailable. Download the Markdown instead.')
            }
          }}
        >
          Copy Markdown
        </Button>
      </Actions>
      {message && <TaskMeta role="status">{message}</TaskMeta>}
      <HandoffPreview
        role="region"
        tabIndex={0}
        aria-label="Markdown handoff preview"
      >
        {handoff.markdown}
      </HandoffPreview>
    </ArtifactPanel>
  )
}

interface ReviewDecisionsProps {
  task: DeliveryTask
  editable: boolean
  reviewer?: DeliveryReviewer
  onReview: (input: DeliveryReviewInput) => TaskWrite<DeliveryTask | null>
}

function ReviewDecisions({
  task,
  editable,
  reviewer: suppliedReviewer,
  onReview,
}: ReviewDecisionsProps) {
  const [reason, setReason] = useState('')
  const [returnStage, setReturnStage] =
    useState<DeliveryReviewReturnStage>('implementation')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const latest = task.reviewDecisions.at(-1)
  const validationBlocker = getDeliveryStageBlocker(task, 'validation')
  const reviewer = suppliedReviewer ?? {
    id: 'demo-reviewer',
    name: 'Demo reviewer',
    source: 'simulated' as const,
  }
  const decide = async (input: DeliveryReviewInput) => {
    setSaving(true)
    try {
      const updated = await onReview(input)
      if (!updated) throw new Error('Task is no longer available.')
      setError('')
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Could not save review.'
      )
    } finally {
      setSaving(false)
    }
  }
  const decisionText = (decision: DeliveryTask['reviewDecisions'][number]) =>
    `${decision.decision === 'approved' ? 'Approved' : `Changes requested: ${decision.reason} · Return to ${decision.returnStage}`} · ${decision.reviewer.name} (${decision.reviewer.source === 'simulated' ? 'simulated reviewer' : 'signed-in owner; self-review'}) · ${new Date(decision.recordedAt).toLocaleString()} · Task revision ${decision.taskRevision}${decision.taskRevision !== task.revision ? ' · Stale — review again' : ''}`

  return (
    <ArtifactPanel aria-label="Review decision">
      <h2>Review decision</h2>
      <ArtifactMeta>
        {reviewer.source === 'simulated'
          ? 'The demo reviewer is simulated.'
          : 'Review is recorded by the signed-in owner; this is self-review, not an independent review.'}
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
            void decide({
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
              disabled={Boolean(validationBlocker) || saving}
              onClick={() => void decide({ decision: 'approved', reviewer })}
            >
              Approve review
            </Button>
            <Button type="submit" variant="secondary" disabled={saving}>
              {saving ? 'Saving…' : 'Request changes'}
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
  contextRevision: number
  artifact: DeliveryArtifact | undefined
  onSave: TaskDetailPageProps['onSaveArtifact']
}

const StageArtifactEditor = ({
  taskId,
  stage,
  intentRevision,
  contextRevision,
  artifact,
  onSave,
}: StageArtifactEditorProps) => {
  const info = ARTIFACT_STAGE_INFO[stage]!
  const [editing, setEditing] = useState(!artifact)
  const [draft, setDraft] = useState(artifact?.content ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      const updated = await onSave(taskId, stage, draft)
      if (!updated) throw new Error('Task is no longer available.')
      setEditing(false)
      setError('')
    } catch (caught) {
      if (caught instanceof DeliveryArtifactInputError) setError(caught.message)
      else if (caught instanceof DeliveryTaskConflictError)
        setError(caught.message)
      else setError('Could not save these notes. Try again.')
    } finally {
      setSaving(false)
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
      {stage === 'planning' && (
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                editing ? draft : (artifact?.content ?? '')
              )
              setError('')
            } catch {
              setError('Copy unavailable. Select the plan text to copy it.')
            }
          }}
        >
          Copy plan
        </Button>
      )}
      {!editing && error && <FieldError role="alert">{error}</FieldError>}
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
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : `Save ${info.label}`}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={cancel}
              disabled={saving}
            >
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
                Revision {artifact.revision} · Source:{' '}
                {ARTIFACT_SOURCE_LABELS[artifact.source]} · Created{' '}
                {new Date(artifact.createdAt).toLocaleString()} · Updated{' '}
                {new Date(artifact.updatedAt).toLocaleString()}
              </ArtifactMeta>
              {stage === 'planning' &&
                (artifact.contextRevision ?? 0) !== contextRevision && (
                  <TaskMeta role="note">
                    This saved plan may be outdated. Review it before use.
                  </TaskMeta>
                )}
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
  const [saving, setSaving] = useState(false)
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      const updated = await onSave(
        taskId,
        check.id,
        status,
        note,
        status === 'pending' ? null : source
      )
      if (!updated) throw new Error('Task is no longer available.')
      setError('')
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Could not save result.'
      )
    } finally {
      setSaving(false)
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
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : `Save ${check.name} result`}
            </Button>
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

export const UnknownTaskPage = ({
  basePath = '/demo',
}: {
  basePath?: string
}) => (
  <TaskPage>
    <Breadcrumb to={`${basePath}/tasks`}>← All tasks</Breadcrumb>
    <PageHeading title="Task not found" basePath={basePath} />
    <Content>
      <TaskMeta role="status">
        {basePath === '/demo'
          ? 'This task is unavailable in the current demo session. It may have been cleared when the page reloaded.'
          : 'This task was not found in your private workspace.'}
      </TaskMeta>
    </Content>
  </TaskPage>
)
