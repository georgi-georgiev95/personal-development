import {
  applyUpdate,
  replaceItemCur,
  replaceMany,
  replaceWithin,
} from '@/shared/utils/objectMutations'

export interface DeliveryTaskInput {
  title: string
  goal: string
}

export const DELIVERY_STAGES = [
  'discovery',
  'planning',
  'implementation',
  'validation',
  'review',
  'handoff',
] as const

export type DeliveryStage = (typeof DELIVERY_STAGES)[number]

export type DeliveryArtifactStage =
  | 'discovery'
  | 'planning'
  | 'implementation'
  | 'review'

export type DeliveryArtifactKind =
  | 'discovery-notes'
  | 'plan'
  | 'implementation-notes'
  | 'review-notes'

export const DELIVERY_CONTEXT_MAX_ENTRIES = 5
export const DELIVERY_CONTEXT_MAX_NAME_LENGTH = 80
export const DELIVERY_CONTEXT_MAX_CONTENT_LENGTH = 20_000

export interface DeliveryContextEntry {
  id: string
  name: string
  content: string
  revision: number
  createdAt: string
  updatedAt: string
}

export interface DeliveryContextInput {
  id?: string
  name: string
  content: string
}

export const REQUIRED_VALIDATION_CHECKS = [
  { id: 'typecheck', name: 'Typecheck' },
  { id: 'lint', name: 'Lint' },
  { id: 'coverage', name: 'Coverage' },
  { id: 'build-performance', name: 'Build and performance' },
] as const

export type DeliveryValidationCheckId =
  (typeof REQUIRED_VALIDATION_CHECKS)[number]['id']
export type DeliveryValidationStatus = 'pending' | 'passed' | 'failed'
export type DeliveryValidationSource = 'manual' | 'ci' | 'demo'
type UserValidationSource = Exclude<DeliveryValidationSource, 'demo'>

export interface DeliveryValidationEvidence {
  status: Exclude<DeliveryValidationStatus, 'pending'>
  note: string
  source: DeliveryValidationSource
  recordedAt: string
  taskRevision: number
  workRevision: number
  revision: number
}

export interface DeliveryValidationCheck {
  id: DeliveryValidationCheckId
  name: string
  required: true
  status: DeliveryValidationStatus
  evidence?: DeliveryValidationEvidence
  history: DeliveryValidationEvidence[]
  revision: number
  updatedAt: string
}

export interface DeliveryArtifact {
  stage: DeliveryArtifactStage
  kind: DeliveryArtifactKind
  content: string
  source: 'manual' | 'ai' | 'demo'
  revision: number
  taskRevision: number
  contextRevision?: number
  createdAt: string
  updatedAt: string
}

export interface DeliveryReviewer {
  id: string
  name: string
  source: 'simulated' | 'owner'
}

export const DELIVERY_REVIEW_RETURN_STAGES = [
  'discovery',
  'planning',
  'implementation',
  'validation',
] as const
export type DeliveryReviewReturnStage =
  (typeof DELIVERY_REVIEW_RETURN_STAGES)[number]

export type DeliveryReviewInput = { reviewer: DeliveryReviewer } & (
  | { decision: 'approved' }
  | {
      decision: 'changes-requested'
      reason: string
      returnStage: DeliveryReviewReturnStage
    }
)

export type DeliveryReviewDecision = DeliveryReviewInput & {
  taskRevision: number
  recordedAt: string
}

export interface DeliveryTask extends DeliveryTaskInput {
  id: string
  persistenceRevision?: number
  stage: DeliveryStage
  intentRevision: number
  revision: number
  workRevision: number
  artifacts: Partial<Record<DeliveryArtifactStage, DeliveryArtifact>>
  validationChecks: DeliveryValidationCheck[]
  reviewDecisions: DeliveryReviewDecision[]
  contextEntries?: DeliveryContextEntry[]
  contextRevision?: number
  createdAt: string
  updatedAt: string
}

export class DeliveryTaskInputError extends Error {
  constructor(
    public readonly field: keyof DeliveryTaskInput,
    message: string
  ) {
    super(message)
    this.name = 'DeliveryTaskInputError'
  }
}

export class DeliveryTaskStageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DeliveryTaskStageError'
  }
}

export class DeliveryTaskConflictError extends Error {
  constructor() {
    super('This task changed in another tab. Reload it before saving again.')
    this.name = 'DeliveryTaskConflictError'
  }
}

export class DeliveryArtifactInputError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DeliveryArtifactInputError'
  }
}

export class DeliveryContextInputError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DeliveryContextInputError'
  }
}

export class DeliveryValidationInputError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DeliveryValidationInputError'
  }
}

const normalizeInput = ({
  title,
  goal,
}: DeliveryTaskInput): DeliveryTaskInput => {
  const normalized = { title: title.trim(), goal: goal.trim() }
  if (!normalized.title) {
    throw new DeliveryTaskInputError('title', 'Enter a task title.')
  }
  if (!normalized.goal) {
    throw new DeliveryTaskInputError('goal', 'Enter the task goal.')
  }
  return normalized
}

export const createDeliveryTask = (input: DeliveryTaskInput): DeliveryTask => {
  const normalized = normalizeInput(input)
  const now = new Date().toISOString()
  return {
    title: normalized.title,
    goal: normalized.goal,
    id: crypto.randomUUID(),
    stage: 'discovery',
    intentRevision: 1,
    revision: 1,
    workRevision: 1,
    artifacts: {},
    contextEntries: [],
    contextRevision: 0,
    reviewDecisions: [],
    validationChecks: REQUIRED_VALIDATION_CHECKS.map(({ id, name }) => ({
      id,
      name,
      required: true,
      status: 'pending',
      history: [],
      revision: 0,
      updatedAt: now,
    })),
    createdAt: now,
    updatedAt: now,
  }
}

export const saveDeliveryContextEntry = (
  task: DeliveryTask,
  input: DeliveryContextInput
): DeliveryTask => {
  const name = input.name.trim()
  if (!name) throw new DeliveryContextInputError('Enter a context name.')
  if (name.length > DELIVERY_CONTEXT_MAX_NAME_LENGTH) {
    throw new DeliveryContextInputError(
      `Keep the context name under ${DELIVERY_CONTEXT_MAX_NAME_LENGTH} characters.`
    )
  }
  if (!input.content.trim()) {
    throw new DeliveryContextInputError('Paste some project context.')
  }
  if (input.content.length > DELIVERY_CONTEXT_MAX_CONTENT_LENGTH) {
    throw new DeliveryContextInputError(
      `Keep context under ${DELIVERY_CONTEXT_MAX_CONTENT_LENGTH.toLocaleString()} characters.`
    )
  }

  const entries = task.contextEntries ?? []
  const existing =
    input.id !== undefined
      ? entries.find((entry) => entry.id === input.id)
      : undefined
  if (input.id !== undefined && !existing) {
    throw new DeliveryContextInputError('That context entry no longer exists.')
  }
  if (
    entries.some(
      (entry) =>
        entry.id !== input.id && entry.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    throw new DeliveryContextInputError(
      'Choose a different name for this context entry.'
    )
  }
  if (!existing && entries.length >= DELIVERY_CONTEXT_MAX_ENTRIES) {
    throw new DeliveryContextInputError(
      `A task can have up to ${DELIVERY_CONTEXT_MAX_ENTRIES} context entries.`
    )
  }
  if (
    existing &&
    existing.name === name &&
    existing.content === input.content
  ) {
    return task
  }

  const now = new Date().toISOString()
  const saved: DeliveryContextEntry = {
    id: existing?.id ?? crypto.randomUUID(),
    name,
    content: input.content,
    revision: (existing?.revision ?? 0) + 1,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }

  return {
    ...task,
    contextEntries: existing
      ? entries.map((entry) => (entry.id === existing.id ? saved : entry))
      : [...entries, saved],
    contextRevision: (task.contextRevision ?? 0) + 1,
    revision: task.revision + 1,
    updatedAt: now,
  }
}

export const removeDeliveryContextEntry = (
  task: DeliveryTask,
  id: string
): DeliveryTask => {
  const entries = task.contextEntries ?? []
  if (!entries.some((entry) => entry.id === id)) {
    throw new DeliveryContextInputError('That context entry no longer exists.')
  }
  const now = new Date().toISOString()
  return {
    ...task,
    contextEntries: entries.filter((entry) => entry.id !== id),
    contextRevision: (task.contextRevision ?? 0) + 1,
    revision: task.revision + 1,
    updatedAt: now,
  }
}

export const updateDeliveryTask = (
  task: DeliveryTask,
  input: DeliveryTaskInput
): DeliveryTask => {
  const normalized = normalizeInput(input)
  const intentChanged =
    normalized.title !== task.title || normalized.goal !== task.goal
  const updated = replaceMany(task, {
    title: () => normalized.title,
    goal: () => normalized.goal,
    intentRevision: () => task.intentRevision + Number(intentChanged),
    revision: () => task.revision + Number(intentChanged),
    workRevision: () => task.workRevision + Number(intentChanged),
    updatedAt: () => new Date().toISOString(),
  })
  return intentChanged
    ? replaceWithin(updated, 'stage', () => 'discovery' as const)
    : updated
}

const ARTIFACT_KINDS: Record<DeliveryArtifactStage, DeliveryArtifactKind> = {
  discovery: 'discovery-notes',
  planning: 'plan',
  implementation: 'implementation-notes',
  review: 'review-notes',
}

export const saveDeliveryArtifact = (
  task: DeliveryTask,
  stage: DeliveryArtifactStage,
  content: string,
  source: DeliveryArtifact['source'] = task.artifacts[stage]?.source ?? 'manual'
): DeliveryTask => {
  if (!content.trim()) {
    throw new DeliveryArtifactInputError('Enter some notes before saving.')
  }

  const previous = task.artifacts[stage]
  const planContextChanged =
    stage === 'planning' &&
    previous?.contextRevision !== (task.contextRevision ?? 0)
  if (
    previous?.content === content &&
    previous.source === source &&
    previous.taskRevision === task.intentRevision &&
    previous.contextRevision ===
      (stage === 'planning' ? (task.contextRevision ?? 0) : undefined)
  ) {
    return task
  }

  const now = new Date().toISOString()
  const artifact: DeliveryArtifact = {
    stage,
    kind: ARTIFACT_KINDS[stage],
    content,
    source,
    revision: (previous?.revision ?? 0) + 1,
    taskRevision: task.intentRevision,
    ...(stage === 'planning'
      ? { contextRevision: task.contextRevision ?? 0 }
      : {}),
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  }
  const updated = applyUpdate(task, {
    artifacts: replaceWithin(task.artifacts, stage, () => artifact),
    revision: task.revision + 1,
    workRevision:
      task.workRevision +
      Number(
        stage !== 'review' &&
          (previous?.content !== content || planContextChanged)
      ),
    updatedAt: now,
  })
  return previous?.content !== content &&
    DELIVERY_STAGES.indexOf(stage) < DELIVERY_STAGES.indexOf(task.stage)
    ? replaceWithin(updated, 'stage', () => stage)
    : updated
}

export const recordDeliveryValidationResult = (
  task: DeliveryTask,
  checkId: DeliveryValidationCheckId,
  status: DeliveryValidationStatus,
  note: string,
  source: UserValidationSource | null
): DeliveryTask => {
  if (task.stage !== 'validation') {
    throw new DeliveryValidationInputError(
      'Validation results can only be recorded during the validation stage.'
    )
  }
  const check = task.validationChecks.find(({ id }) => id === checkId)
  if (!check) {
    throw new DeliveryValidationInputError(
      'Choose a required validation check.'
    )
  }
  if (status !== 'pending' && !source) {
    throw new DeliveryValidationInputError('Choose an evidence source.')
  }
  if (status === 'passed' && !note.trim()) {
    throw new DeliveryValidationInputError(
      'Add an evidence note or URL before marking a check passed.'
    )
  }

  const unchanged =
    check.status === status &&
    (status === 'pending' ||
      (check.evidence?.note === note &&
        check.evidence.source === source &&
        check.evidence.workRevision === task.workRevision))
  if (unchanged) return task

  const now = new Date().toISOString()
  const evidence =
    status === 'pending'
      ? undefined
      : {
          status,
          note: note.trim(),
          source: source!,
          recordedAt: now,
          taskRevision: task.revision + 1,
          workRevision: task.workRevision,
          revision: check.revision + 1,
        }
  const updatedCheck: DeliveryValidationCheck = {
    ...check,
    status,
    evidence,
    history: check.evidence
      ? [...check.history, check.evidence]
      : check.history,
    revision: check.revision + 1,
    updatedAt: now,
  }
  return applyUpdate(task, {
    validationChecks: task.validationChecks.map((item) =>
      item.id === checkId ? updatedCheck : item
    ),
    revision: task.revision + 1,
    updatedAt: now,
  })
}

export const getDeliveryStageBlocker = (
  task: DeliveryTask,
  stage: DeliveryStage
): string | null => {
  if (stage === 'validation') {
    const blockers = task.validationChecks
      .filter(({ required }) => required)
      .flatMap((check) => {
        if (check.status === 'pending')
          return [`${check.name} has not been run.`]
        if (check.evidence?.source === 'demo') {
          return [
            `${check.name} has simulated evidence, which cannot pass review.`,
          ]
        }
        if (check.evidence?.workRevision !== task.workRevision) {
          return [`${check.name} evidence is stale for this task revision.`]
        }
        if (check.status === 'failed') return [`${check.name} failed.`]
        if (!check.evidence?.note.trim()) {
          return [`${check.name} needs an evidence note or URL.`]
        }
        return []
      })
    return blockers.length ? `Review is blocked: ${blockers.join(' ')}` : null
  }
  if (stage === 'review') {
    const validationBlocker = getDeliveryStageBlocker(task, 'validation')
    if (validationBlocker) return validationBlocker
    const latest = task.reviewDecisions.at(-1)
    if (!latest) return 'Review needs an explicit approval.'
    if (latest.taskRevision !== task.revision) {
      return 'The review decision is stale. Review the current revision again.'
    }
    return latest.decision === 'approved'
      ? null
      : 'Changes were requested. Resolve them and review again.'
  }
  if (stage === 'handoff') {
    return task.stage === 'handoff'
      ? getDeliveryStageBlocker(task, 'review')
      : 'Complete earlier stages before handoff.'
  }
  return null
}

export const recordDeliveryReviewDecision = (
  task: DeliveryTask,
  input: DeliveryReviewInput
): DeliveryTask => {
  if (task.stage !== 'review') {
    throw new DeliveryTaskStageError(
      'Decisions can only be recorded during review.'
    )
  }
  if (!input.reviewer.id.trim() || !input.reviewer.name.trim()) {
    throw new DeliveryTaskStageError('Identify the reviewer.')
  }
  const normalized =
    input.decision === 'changes-requested'
      ? { ...input, reason: input.reason.trim() }
      : input
  if (normalized.decision === 'changes-requested' && !normalized.reason) {
    throw new DeliveryTaskStageError('Give a reason for requesting changes.')
  }
  if (
    normalized.decision === 'changes-requested' &&
    !DELIVERY_REVIEW_RETURN_STAGES.includes(normalized.returnStage)
  ) {
    throw new DeliveryTaskStageError(
      'Choose an earlier stage for the requested changes.'
    )
  }
  const stage =
    normalized.decision === 'approved' ? 'handoff' : normalized.returnStage
  if (normalized.decision === 'approved') {
    const blocker = getDeliveryStageBlocker(task, 'validation')
    if (blocker) throw new DeliveryTaskStageError(blocker)
  }
  const now = new Date().toISOString()
  return applyUpdate(task, {
    stage,
    reviewDecisions: [
      ...task.reviewDecisions,
      {
        ...normalized,
        reviewer: { ...normalized.reviewer },
        taskRevision: task.revision,
        recordedAt: now,
      },
    ],
    updatedAt: now,
  })
}

const HANDOFF_BLOCKER =
  'Handoff is the final stage. Preview or export the handoff.'

export const completeDeliveryTaskStage = (
  task: DeliveryTask,
  stage: DeliveryStage
): DeliveryTask => {
  if (stage !== task.stage) {
    throw new DeliveryTaskStageError('Only the current stage can be completed.')
  }
  if (stage === 'handoff') throw new DeliveryTaskStageError(HANDOFF_BLOCKER)
  const blocker = getDeliveryStageBlocker(task, stage)
  if (blocker) throw new DeliveryTaskStageError(blocker)
  // Handoff is the final entry in the fixed workflow sequence.
  const updated = replaceItemCur(task, 'stage', (current) => {
    return DELIVERY_STAGES[DELIVERY_STAGES.indexOf(current.stage) + 1]!
  })
  return applyUpdate(updated, { updatedAt: new Date().toISOString() })
}

export const reopenDeliveryTaskStage = (
  task: DeliveryTask,
  stage: DeliveryStage
): DeliveryTask => {
  if (DELIVERY_STAGES.indexOf(stage) >= DELIVERY_STAGES.indexOf(task.stage)) {
    throw new DeliveryTaskStageError('Only a completed stage can be reopened.')
  }
  return applyUpdate(task, { stage, updatedAt: new Date().toISOString() })
}
