import { applyUpdate } from '@/shared/utils/objectMutations'
import { describe, expect, it } from 'vitest'
import {
  completeDeliveryTaskStage,
  createDeliveryTask,
  DeliveryArtifactInputError,
  DeliveryValidationInputError,
  type DeliveryValidationCheckId,
  DeliveryTaskInputError,
  DeliveryTaskStageError,
  getDeliveryStageBlocker,
  reopenDeliveryTaskStage,
  recordDeliveryValidationResult,
  REQUIRED_VALIDATION_CHECKS,
  saveDeliveryArtifact,
  updateDeliveryTask,
} from './deliveryTask'

const makeValidationTask = () =>
  completeDeliveryTaskStage(
    completeDeliveryTaskStage(
      completeDeliveryTaskStage(
        createDeliveryTask({ title: 'First', goal: 'Goal' }),
        'discovery'
      ),
      'planning'
    ),
    'implementation'
  )

describe('createDeliveryTask', () => {
  it('trims and creates a distinct task at discovery', () => {
    const first = createDeliveryTask({ title: '  First  ', goal: '  Goal  ' })
    const second = createDeliveryTask({ title: 'Second', goal: 'Other goal' })

    expect(first).toMatchObject({
      title: 'First',
      goal: 'Goal',
      stage: 'discovery',
      createdAt: first.updatedAt,
    })
    expect(first.id).toBeTruthy()
    expect(second.id).not.toBe(first.id)
  })

  it.each([
    [{ title: '   ', goal: 'A goal' }, 'title', 'Enter a task title.'],
    [{ title: 'A title', goal: '  ' }, 'goal', 'Enter the task goal.'],
  ] as const)('rejects invalid input %#', (input, field, message) => {
    expect(() => createDeliveryTask(input)).toThrowError(
      new DeliveryTaskInputError(field, message)
    )
  })
})

describe('updateDeliveryTask', () => {
  it('returns an updated task without mutating the original', () => {
    const original = createDeliveryTask({ title: 'First', goal: 'Initial' })
    const unchanged = createDeliveryTask({ title: 'Second', goal: 'Other' })
    const updated = updateDeliveryTask(original, {
      title: ' Revised ',
      goal: ' New goal ',
    })

    expect(updated).toMatchObject({
      id: original.id,
      title: 'Revised',
      goal: 'New goal',
      stage: original.stage,
      createdAt: original.createdAt,
    })
    expect(updated.updatedAt).toBeTruthy()
    expect(original.title).toBe('First')
    expect(unchanged).toMatchObject({ title: 'Second', goal: 'Other' })
  })

  it('reopens discovery when task intent changes', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })
    const inPlanning = completeDeliveryTaskStage(task, 'discovery')

    expect(
      updateDeliveryTask(inPlanning, { title: 'Changed', goal: 'Goal' }).stage
    ).toBe('discovery')
    expect(
      updateDeliveryTask(inPlanning, { title: 'First', goal: 'New' }).stage
    ).toBe('discovery')
    expect(
      updateDeliveryTask(inPlanning, { title: 'First', goal: 'Goal' }).stage
    ).toBe('planning')
  })

  it('advances the task intent revision only when its intent changes', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })

    expect(
      updateDeliveryTask(task, { title: 'First', goal: 'Goal' }).intentRevision
    ).toBe(task.intentRevision)
    expect(
      updateDeliveryTask(task, { title: 'Changed', goal: 'Goal' })
        .intentRevision
    ).toBe(task.intentRevision + 1)
  })
})

describe('saveDeliveryArtifact', () => {
  it('stores plain text only on its task and stage and advances revisions', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })
    const content = '<script>alert("hello")</script>\nNotes'
    const first = saveDeliveryArtifact(task, 'discovery', content)
    const next = saveDeliveryArtifact(first, 'discovery', 'Updated notes')

    expect(first.artifacts.discovery).toMatchObject({
      stage: 'discovery',
      kind: 'discovery-notes',
      content,
      source: 'manual',
      revision: 1,
      taskRevision: task.intentRevision,
    })
    expect(next.artifacts.discovery).toMatchObject({
      content: 'Updated notes',
      revision: 2,
    })
    expect(next.artifacts.planning).toBeUndefined()
    expect(task.artifacts.discovery).toBeUndefined()
  })

  it('rejects blank content and does not advance an unchanged note', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })
    const saved = saveDeliveryArtifact(task, 'planning', 'Plan')

    expect(() => saveDeliveryArtifact(task, 'planning', '  \n')).toThrowError(
      new DeliveryArtifactInputError('Enter some notes before saving.')
    )
    expect(saveDeliveryArtifact(saved, 'planning', 'Plan')).toBe(saved)
  })

  it('marks an artifact against the task intent revision it was saved for', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })
    const note = saveDeliveryArtifact(task, 'review', 'Looks good')
    const revisedTask = updateDeliveryTask(note, {
      title: 'First',
      goal: 'Changed goal',
    })
    const refreshedNote = saveDeliveryArtifact(
      revisedTask,
      'review',
      'Looks good'
    )

    expect(revisedTask.artifacts.review?.taskRevision).toBe(task.intentRevision)
    expect(refreshedNote.artifacts.review?.taskRevision).toBe(
      revisedTask.intentRevision
    )
    expect(refreshedNote.artifacts.review?.revision).toBe(2)
  })
})

describe('delivery validation results', () => {
  it('starts required checks pending and blocks review with clear reasons', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })

    expect(task.validationChecks).toHaveLength(4)
    expect(task.validationChecks.every((check) => check.required)).toBe(true)
    expect(
      task.validationChecks.every((check) => check.status === 'pending')
    ).toBe(true)
    expect(getDeliveryStageBlocker(task, 'validation')).toBe(
      'Review is blocked: Typecheck has not been run. Lint has not been run. Coverage has not been run. Build and performance has not been run.'
    )
  })

  it('requires a source and evidence before reporting a check as passed', () => {
    const task = makeValidationTask()

    expect(() =>
      recordDeliveryValidationResult(task, 'typecheck', 'passed', '', 'manual')
    ).toThrowError(
      new DeliveryValidationInputError(
        'Add an evidence note or URL before marking a check passed.'
      )
    )
    expect(() =>
      recordDeliveryValidationResult(task, 'lint', 'failed', '', null)
    ).toThrowError(
      new DeliveryValidationInputError('Choose an evidence source.')
    )
    expect(() =>
      recordDeliveryValidationResult(
        task,
        'missing' as DeliveryValidationCheckId,
        'pending',
        '',
        null
      )
    ).toThrowError(
      new DeliveryValidationInputError('Choose a required validation check.')
    )
  })

  it('only records results during the validation stage', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })

    expect(() =>
      recordDeliveryValidationResult(task, 'typecheck', 'failed', '', 'manual')
    ).toThrowError(
      new DeliveryValidationInputError(
        'Validation results can only be recorded during the validation stage.'
      )
    )
  })

  it('blocks failed required checks and opens review only when all current checks pass', () => {
    const task = makeValidationTask()
    const failed = recordDeliveryValidationResult(
      task,
      'typecheck',
      'failed',
      '',
      'manual'
    )
    expect(getDeliveryStageBlocker(failed, 'validation')).toContain(
      'Typecheck failed.'
    )

    const passed = REQUIRED_VALIDATION_CHECKS.reduce(
      (current, check) =>
        recordDeliveryValidationResult(
          current,
          check.id,
          'passed',
          'See validation log',
          'manual'
        ),
      task
    )
    const currentResults = REQUIRED_VALIDATION_CHECKS.reduce(
      (current, check) =>
        recordDeliveryValidationResult(
          current,
          check.id,
          'passed',
          'See validation log',
          'manual'
        ),
      task
    )

    expect(getDeliveryStageBlocker(passed, 'validation')).toBeNull()
    expect(completeDeliveryTaskStage(currentResults, 'validation').stage).toBe(
      'review'
    )
  })

  it('makes prior evidence stale after reviewed work changes', () => {
    const task = makeValidationTask()
    const passed = REQUIRED_VALIDATION_CHECKS.reduce(
      (current, check) =>
        recordDeliveryValidationResult(
          current,
          check.id,
          'passed',
          'See validation log',
          'ci'
        ),
      task
    )
    const taskInReview = applyUpdate(passed, { stage: 'review' })
    const changed = saveDeliveryArtifact(
      taskInReview,
      'implementation',
      'Changed implementation'
    )

    expect(changed.revision).toBe(passed.revision + 1)
    expect(changed.stage).toBe('implementation')
    expect(getDeliveryStageBlocker(changed, 'validation')).toContain(
      'Typecheck evidence is stale for this task revision.'
    )
  })

  it('keeps prior evidence when a result is updated or reset', () => {
    const task = makeValidationTask()
    const passed = recordDeliveryValidationResult(
      task,
      'coverage',
      'passed',
      'Coverage report',
      'manual'
    )
    expect(
      recordDeliveryValidationResult(
        passed,
        'coverage',
        'passed',
        'Coverage report',
        'manual'
      )
    ).toBe(passed)
    const failed = recordDeliveryValidationResult(
      passed,
      'coverage',
      'failed',
      '',
      'ci'
    )
    const reset = recordDeliveryValidationResult(
      failed,
      'coverage',
      'pending',
      '',
      null
    )

    expect(failed.validationChecks[2]).toMatchObject({
      status: 'failed',
      revision: 2,
      history: [expect.objectContaining({ note: 'Coverage report' })],
    })
    expect(reset.validationChecks[2]).toMatchObject({
      status: 'pending',
      revision: 3,
      history: [
        expect.objectContaining({ note: 'Coverage report' }),
        expect.objectContaining({ status: 'failed', source: 'ci' }),
      ],
    })
    expect(
      recordDeliveryValidationResult(reset, 'coverage', 'pending', '', null)
    ).toBe(reset)
  })

  it('does not treat simulated evidence as a passed check', () => {
    const task = makeValidationTask()
    const check = task.validationChecks[0]
    const withSimulatedEvidence = {
      ...task,
      validationChecks: task.validationChecks.map((item) =>
        item.id === check.id
          ? {
              ...item,
              status: 'passed' as const,
              evidence: {
                status: 'passed' as const,
                note: 'Example only',
                source: 'demo' as const,
                recordedAt: task.createdAt,
                taskRevision: task.revision,
                workRevision: task.workRevision,
                revision: 1,
              },
            }
          : item
      ),
    }

    expect(
      getDeliveryStageBlocker(withSimulatedEvidence, 'validation')
    ).toContain('Typecheck has simulated evidence, which cannot pass review.')
  })

  it('requires an evidence note for malformed passed results and reports no-check tasks explicitly', () => {
    const task = makeValidationTask()
    const invalidPassed = {
      ...task,
      validationChecks: task.validationChecks.map((check, index) =>
        index === 0
          ? {
              ...check,
              status: 'passed' as const,
              evidence: {
                status: 'passed' as const,
                note: '',
                source: 'manual' as const,
                recordedAt: task.createdAt,
                taskRevision: task.revision,
                workRevision: task.workRevision,
                revision: 1,
              },
            }
          : check
      ),
    }
    const noRequiredChecks = { ...task, validationChecks: [] }

    expect(getDeliveryStageBlocker(invalidPassed, 'validation')).toContain(
      'Typecheck needs an evidence note or URL.'
    )
    expect(getDeliveryStageBlocker(noRequiredChecks, 'validation')).toBeNull()
    expect(getDeliveryStageBlocker(task, 'planning')).toBeNull()
  })
})

describe('delivery task stage transitions', () => {
  it('advances only the current stage and permits reopening completed stages', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })
    const planning = completeDeliveryTaskStage(task, 'discovery')
    const implementation = completeDeliveryTaskStage(planning, 'planning')

    expect(implementation.stage).toBe('implementation')
    expect(reopenDeliveryTaskStage(implementation, 'discovery').stage).toBe(
      'discovery'
    )
    expect(task.stage).toBe('discovery')
  })

  it('rejects repeating a completed stage', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })
    const planning = completeDeliveryTaskStage(task, 'discovery')

    expect(() => completeDeliveryTaskStage(planning, 'discovery')).toThrowError(
      new DeliveryTaskStageError('Only the current stage can be completed.')
    )
  })

  it.each([
    ['planning', 'Only the current stage can be completed.'],
    ['validation', 'Only the current stage can be completed.'],
  ] as const)(
    'rejects skipped or repeated completion of %s',
    (stage, message) => {
      const task = createDeliveryTask({ title: 'First', goal: 'Goal' })
      expect(() => completeDeliveryTaskStage(task, stage)).toThrowError(
        new DeliveryTaskStageError(message)
      )
    }
  )

  it.each([
    ['review', 'Review needs validation evidence and an approval record.'],
    [
      'handoff',
      'Handoff needs an approved review, passing required checks, and a summary.',
    ],
  ] as const)('explains the %s prerequisite gate', (stage, message) => {
    expect(
      getDeliveryStageBlocker(
        createDeliveryTask({ title: 'First', goal: 'Goal' }),
        stage
      )
    ).toBe(message)
  })

  it('rejects advancing from validation without evidence', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })
    const validation = completeDeliveryTaskStage(
      completeDeliveryTaskStage(
        completeDeliveryTaskStage(task, 'discovery'),
        'planning'
      ),
      'implementation'
    )

    expect(validation.stage).toBe('validation')
    expect(() =>
      completeDeliveryTaskStage(validation, 'validation')
    ).toThrowError(
      new DeliveryTaskStageError(
        'Review is blocked: Typecheck has not been run. Lint has not been run. Coverage has not been run. Build and performance has not been run.'
      )
    )
  })

  it('keeps handoff closed even if presented as the current stage', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })
    const handoff = applyUpdate(task, { stage: 'handoff' })

    expect(() => completeDeliveryTaskStage(handoff, 'handoff')).toThrowError(
      new DeliveryTaskStageError(
        'Handoff needs an approved review, passing required checks, and a summary.'
      )
    )
  })

  it('rejects reopening a current or pending stage', () => {
    const task = createDeliveryTask({ title: 'First', goal: 'Goal' })
    expect(() => reopenDeliveryTaskStage(task, 'discovery')).toThrowError(
      new DeliveryTaskStageError('Only a completed stage can be reopened.')
    )
    expect(() => reopenDeliveryTaskStage(task, 'handoff')).toThrowError(
      new DeliveryTaskStageError('Only a completed stage can be reopened.')
    )
  })
})
