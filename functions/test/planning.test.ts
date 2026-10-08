import { describe, expect, it, vi } from 'vitest'
import {
  generatePlanDraft,
  PLAN_MAX_CONTEXT_LENGTH,
  PLAN_MAX_REQUEST_BYTES,
  PlannerError,
} from '../src/planning.js'
import type { PlanningDependencies, PlanningTask } from '../src/planning.js'

const task: PlanningTask = {
  id: 'task-1',
  title: 'Improve onboarding',
  goal: 'Make first use clear.',
  contextRevision: 2,
  contextEntries: [
    { id: 'readme', name: 'README', content: 'Use the existing router.' },
    { id: 'agents', name: 'AGENTS', content: 'Use accessible controls.' },
  ],
}

const draft = {
  objective: 'Improve first use.',
  steps: ['Review the entry flow.', 'Implement the smallest change.'],
  acceptanceCriteria: ['New users can start without confusion.'],
  risks: [],
}

const dependencies = (
  overrides: Partial<PlanningDependencies> = {}
): PlanningDependencies => ({
  loadTask: vi.fn(async () => task),
  reserveUsage: vi.fn(async () => true),
  generate: vi.fn(async () => draft),
  ...overrides,
})

describe('generatePlanDraft', () => {
  it('requires authentication before reading a task or calling a provider', async () => {
    const deps = dependencies()
    await expect(
      generatePlanDraft(
        { taskId: 'task-1', contextEntryIds: [], contextRevision: 2 },
        undefined,
        deps
      )
    ).rejects.toMatchObject({ code: 'unauthenticated' })
    expect(deps.loadTask).not.toHaveBeenCalled()
    expect(deps.generate).not.toHaveBeenCalled()
  })

  it('rejects malformed and oversized request data', async () => {
    const deps = dependencies()
    await expect(
      generatePlanDraft(
        { taskId: '../other', contextEntryIds: [], contextRevision: 2 },
        'user-1',
        deps
      )
    ).rejects.toMatchObject({ code: 'invalid-argument' })
    await expect(
      generatePlanDraft(
        {
          taskId: 'task-1',
          contextEntryIds: [],
          contextRevision: 2,
          prompt: 'override',
        },
        'user-1',
        deps
      )
    ).rejects.toMatchObject({ code: 'invalid-argument' })
    await expect(
      generatePlanDraft(
        {
          taskId: 'task-1',
          contextEntryIds: [],
          contextRevision: 2,
          padding: 'x'.repeat(PLAN_MAX_REQUEST_BYTES),
        },
        'user-1',
        deps
      )
    ).rejects.toMatchObject({ code: 'invalid-argument' })
    expect(deps.loadTask).not.toHaveBeenCalled()
  })

  it('looks up the task under the authenticated UID and rejects missing ownership before quota or provider work', async () => {
    const deps = dependencies({ loadTask: vi.fn(async () => null) })
    await expect(
      generatePlanDraft(
        { taskId: 'task-1', contextEntryIds: [], contextRevision: 2 },
        'other-user',
        deps
      )
    ).rejects.toMatchObject({ code: 'not-found' })
    expect(deps.loadTask).toHaveBeenCalledWith('other-user', 'task-1')
    expect(deps.reserveUsage).not.toHaveBeenCalled()
    expect(deps.generate).not.toHaveBeenCalled()
  })

  it('rejects stale context revisions before charging usage or calling the provider', async () => {
    const deps = dependencies()
    await expect(
      generatePlanDraft(
        { taskId: 'task-1', contextEntryIds: ['readme'], contextRevision: 1 },
        'owner',
        deps
      )
    ).rejects.toMatchObject({ code: 'failed-precondition' })
    expect(deps.reserveUsage).not.toHaveBeenCalled()
    expect(deps.generate).not.toHaveBeenCalled()
  })

  it('sends only selected context and attaches the verified revision to a valid draft', async () => {
    const deps = dependencies()
    const result = await generatePlanDraft(
      { taskId: 'task-1', contextEntryIds: ['agents'], contextRevision: 2 },
      'owner',
      deps,
      new Date('2026-10-08T12:00:00.000Z')
    )
    expect(deps.reserveUsage).toHaveBeenCalledWith('owner', '2026-10-08')
    expect(deps.generate).toHaveBeenCalledWith({
      title: task.title,
      goal: task.goal,
      contextEntries: [{ name: 'AGENTS', content: 'Use accessible controls.' }],
      contextRevision: 2,
    })
    expect(result).toEqual({ ...draft, contextRevision: 2 })
  })

  it('bounds selected context and daily usage before calling the provider', async () => {
    const tooMuch = dependencies({
      loadTask: vi.fn(async () => ({
        ...task,
        contextEntries: [
          {
            id: 'large',
            name: 'Large',
            content: 'x'.repeat(PLAN_MAX_CONTEXT_LENGTH + 1),
          },
        ],
      })),
    })
    await expect(
      generatePlanDraft(
        { taskId: 'task-1', contextEntryIds: ['large'], contextRevision: 2 },
        'owner',
        tooMuch
      )
    ).rejects.toMatchObject({ code: 'invalid-argument' })
    expect(tooMuch.reserveUsage).not.toHaveBeenCalled()

    const limited = dependencies({ reserveUsage: vi.fn(async () => false) })
    await expect(
      generatePlanDraft(
        { taskId: 'task-1', contextEntryIds: [], contextRevision: 2 },
        'owner',
        limited
      )
    ).rejects.toMatchObject({ code: 'resource-exhausted' })
    expect(limited.generate).not.toHaveBeenCalled()
  })

  it('rejects malformed provider output and does not return it as an accepted draft', async () => {
    const deps = dependencies({
      generate: vi.fn(async () => ({ ...draft, steps: [] })),
    })
    await expect(
      generatePlanDraft(
        { taskId: 'task-1', contextEntryIds: [], contextRevision: 2 },
        'owner',
        deps
      )
    ).rejects.toMatchObject({ code: 'unavailable' })
  })

  it('maps provider failures to safe callable errors', async () => {
    const deps = dependencies({
      generate: vi.fn(async () => {
        throw new Error('provider response contained private data')
      }),
    })
    await expect(
      generatePlanDraft(
        { taskId: 'task-1', contextEntryIds: [], contextRevision: 2 },
        'owner',
        deps
      )
    ).rejects.toEqual(
      new PlannerError(
        'unavailable',
        'The planning provider is temporarily unavailable.'
      )
    )
  })
})
