export interface DeliveryTaskInput {
  title: string
  goal: string
}

export interface DeliveryTask extends DeliveryTaskInput {
  id: string
  stage: 'discovery'
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
): DeliveryTask => ({
  ...task,
  ...normalizeInput(input),
  updatedAt: new Date().toISOString(),
})
