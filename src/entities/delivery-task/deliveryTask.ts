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

export interface DeliveryTask extends DeliveryTaskInput {
  id: string
  stage: DeliveryStage
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
  const now = new Date().toISOString()
  return {
    ...normalizeInput(input),
    id: crypto.randomUUID(),
    stage: 'discovery',
    createdAt: now,
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
  return {
    ...task,
    ...normalized,
    ...(intentChanged ? { stage: 'discovery' as const } : {}),
    updatedAt: new Date().toISOString(),
  }
}

export const getDeliveryStageBlocker = (
  stage: DeliveryStage
): string | null => {
  if (stage === 'validation') {
    return 'Validation evidence cannot be recorded in this demo yet.'
  }
  if (stage === 'review') {
    return 'Review needs validation evidence and an approval record.'
  }
  if (stage === 'handoff') {
    return HANDOFF_BLOCKER
  }
  return null
}

const HANDOFF_BLOCKER =
  'Handoff needs an approved review, passing required checks, and a summary.'

export const completeDeliveryTaskStage = (
  task: DeliveryTask,
  stage: DeliveryStage
): DeliveryTask => {
  if (stage !== task.stage) {
    throw new DeliveryTaskStageError('Only the current stage can be completed.')
  }
  if (stage === 'handoff') throw new DeliveryTaskStageError(HANDOFF_BLOCKER)
  const blocker = getDeliveryStageBlocker(stage)
  if (blocker) throw new DeliveryTaskStageError(blocker)
  // Handoff is the final entry in the fixed workflow sequence.
  const nextStage = DELIVERY_STAGES[DELIVERY_STAGES.indexOf(stage) + 1]!
  return { ...task, stage: nextStage, updatedAt: new Date().toISOString() }
}

export const reopenDeliveryTaskStage = (
  task: DeliveryTask,
  stage: DeliveryStage
): DeliveryTask => {
  if (DELIVERY_STAGES.indexOf(stage) >= DELIVERY_STAGES.indexOf(task.stage)) {
    throw new DeliveryTaskStageError('Only a completed stage can be reopened.')
  }
  return { ...task, stage, updatedAt: new Date().toISOString() }
}
