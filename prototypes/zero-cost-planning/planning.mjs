export const PLAN_MAX_REQUEST_BYTES = 8_192
export const PLAN_MAX_CONTEXT_ENTRIES = 5
export const PLAN_MAX_CONTEXT_LENGTH = 12_000
export const PLAN_DAILY_LIMIT = 5
export const PLAN_GLOBAL_DAILY_LIMIT = 15

export class PlannerError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'PlannerError'
    this.code = code
  }
}

const isRecord = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function parseInput(data) {
  if (!isRecord(data))
    throw new PlannerError(
      'invalid-argument',
      'Provide a valid planning request.'
    )
  let size
  try {
    size = new TextEncoder().encode(JSON.stringify(data)).length
  } catch {
    throw new PlannerError(
      'invalid-argument',
      'Provide a valid planning request.'
    )
  }
  if (
    size > PLAN_MAX_REQUEST_BYTES ||
    Object.keys(data).some(
      (key) => !['taskId', 'contextEntryIds', 'contextRevision'].includes(key)
    )
  )
    throw new PlannerError(
      'invalid-argument',
      'The planning request is too large.'
    )

  const { taskId, contextEntryIds, contextRevision } = data
  if (
    typeof taskId !== 'string' ||
    !/^[A-Za-z0-9_-]{1,128}$/.test(taskId) ||
    !Array.isArray(contextEntryIds) ||
    contextEntryIds.length > PLAN_MAX_CONTEXT_ENTRIES ||
    contextEntryIds.some(
      (id) => typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(id)
    ) ||
    new Set(contextEntryIds).size !== contextEntryIds.length ||
    !Number.isInteger(contextRevision) ||
    contextRevision < 0
  )
    throw new PlannerError(
      'invalid-argument',
      'Provide a valid planning request.'
    )
  return { taskId, contextEntryIds, contextRevision }
}

function selectedContext(task, ids) {
  if (!ids.length) return []
  if (!Array.isArray(task.contextEntries))
    throw new PlannerError(
      'failed-precondition',
      'Selected project context is unavailable.'
    )
  const entries = task.contextEntries.filter(isRecord)
  const result = []
  let totalLength = 0
  for (const id of ids) {
    const entry = entries.find((candidate) => candidate.id === id)
    if (
      !entry ||
      typeof entry.name !== 'string' ||
      !entry.name.trim() ||
      entry.name.length > 80 ||
      typeof entry.content !== 'string' ||
      !entry.content.trim() ||
      entry.content.length > 20_000
    )
      throw new PlannerError(
        'failed-precondition',
        'Selected project context is invalid.'
      )
    totalLength += entry.content.length
    if (totalLength > PLAN_MAX_CONTEXT_LENGTH)
      throw new PlannerError(
        'invalid-argument',
        'Selected context exceeds the 12,000 character limit.'
      )
    result.push({ name: entry.name, content: entry.content })
  }
  return result
}

function validateDraft(value, contextRevision) {
  if (!isRecord(value))
    throw new PlannerError(
      'unavailable',
      'The planning provider returned an invalid draft.'
    )
  const validStrings = (input, min, max) =>
    Array.isArray(input) &&
    input.length >= min &&
    input.length <= max &&
    input.every(
      (item) =>
        typeof item === 'string' && item.trim().length > 0 && item.length <= 500
    )
  const { objective, steps, acceptanceCriteria, risks } = value
  if (
    typeof objective !== 'string' ||
    !objective.trim() ||
    objective.length > 500 ||
    !validStrings(steps, 2, 8) ||
    !validStrings(acceptanceCriteria, 1, 8) ||
    !validStrings(risks, 0, 5)
  )
    throw new PlannerError(
      'unavailable',
      'The planning provider returned an invalid draft.'
    )
  return { objective, steps, acceptanceCriteria, risks, contextRevision }
}

export async function generatePlanDraft(
  data,
  uid,
  dependencies,
  now = new Date()
) {
  if (!uid)
    throw new PlannerError('unauthenticated', 'Sign in to generate a plan.')
  if (dependencies.isEnabled && !dependencies.isEnabled())
    throw new PlannerError(
      'failed-precondition',
      'Planning is temporarily disabled. Your work is still safe.'
    )
  const input = parseInput(data)
  const task = await dependencies.loadTask(uid, input.taskId)
  if (!task || task.id !== input.taskId)
    throw new PlannerError('not-found', 'The task was not found.')
  if (
    typeof task.title !== 'string' ||
    !task.title.trim() ||
    task.title.length > 500 ||
    typeof task.goal !== 'string' ||
    !task.goal.trim() ||
    task.goal.length > 2_000
  )
    throw new PlannerError(
      'failed-precondition',
      'The task needs a title and goal within supported limits.'
    )
  const contextRevision = task.contextRevision ?? 0
  if (input.contextRevision !== contextRevision)
    throw new PlannerError(
      'failed-precondition',
      'Project context changed. Reload the task and try again.'
    )
  const contextEntries = selectedContext(task, input.contextEntryIds)
  if (!(await dependencies.reserveUsage(uid, now.toISOString().slice(0, 10))))
    throw new PlannerError(
      'resource-exhausted',
      'Daily plan generation limit reached. Try again tomorrow.'
    )
  let generated
  try {
    generated = await dependencies.generate({
      title: task.title,
      goal: task.goal,
      contextEntries,
      contextRevision,
    })
  } catch (error) {
    if (error instanceof PlannerError) throw error
    throw new PlannerError(
      'unavailable',
      'The planning provider is temporarily unavailable.'
    )
  }
  return validateDraft(generated, contextRevision)
}
