import { describe, expect, it } from 'vitest'
import {
  acceptDeliveryPlan,
  isDeliveryPlanCurrent,
  type DeliveryPlanProposal,
} from '@/entities/delivery-task/deliveryPlan'
import {
  completeDeliveryTaskStage,
  createDeliveryTask,
  getDeliveryStageBlocker,
  recordDeliveryReviewDecision,
  recordDeliveryValidationResult,
  saveDeliveryArtifact,
  saveDeliveryContextEntry,
  updateDeliveryTask,
  type DeliveryTask,
} from '@/entities/delivery-task/deliveryTask'
import { createDeliveryHandoff } from '@/entities/delivery-task/deliveryHandoff'

function proposal(task: DeliveryTask): DeliveryPlanProposal {
  return {
    taskId: task.id,
    taskRevision: task.revision,
    contextRevision: task.contextRevision ?? 0,
    source: 'ai',
    objective: ' Edited goal ',
    steps: [' First step ', '', 'Second step'],
    acceptanceCriteria: [' Outcome is verified ', ''],
    risks: [' A risk ', ''],
  }
}

describe('acceptDeliveryPlan', () => {
  it('keeps a draft separate from recorded work until explicit acceptance and retains its source', () => {
    const task = saveDeliveryArtifact(
      createDeliveryTask({ title: 'Task', goal: 'Goal' }),
      'planning',
      'Original plan'
    )
    const original = structuredClone(task)
    const draft = proposal(task)
    expect(isDeliveryPlanCurrent(task, draft)).toBe(true)
    expect(task).toEqual(original) // Discarding a proposal requires no task mutation.
    const accepted = acceptDeliveryPlan(task, draft)
    expect(task).toEqual(original)
    expect(accepted.artifacts.planning).toMatchObject({
      source: 'ai',
      contextRevision: 0,
      revision: 2,
      content:
        'Objective\nEdited goal\n\nSteps\n- First step\n- Second step\n\nAcceptance criteria\n- Outcome is verified\n\nRisks\n- A risk',
      createdAt: task.artifacts.planning!.createdAt,
    })
    const handoff = createDeliveryHandoff(accepted).markdown
    expect(handoff).toContain('AI-assisted plan · accepted by owner')
    expect(handoff).toContain('Context revision 0')
    expect(handoff).toContain('explicitly requested plan drafting')
    const edited = saveDeliveryArtifact(
      accepted,
      'planning',
      'Owner edited the accepted plan'
    )
    expect(edited.artifacts.planning!.source).toBe('ai')
    expect(
      saveDeliveryArtifact(
        edited,
        'planning',
        edited.artifacts.planning!.content
      )
    ).toBe(edited)
    const simulated = acceptDeliveryPlan(task, {
      ...draft,
      source: 'demo',
      risks: [],
    })
    expect(createDeliveryHandoff(simulated).markdown).toContain(
      'Simulated demo plan · fixture response'
    )
    expect(simulated.artifacts.planning!.content).toContain('None recorded.')
  })

  it('rejects responses from another task or an older task, artifact, or context revision', () => {
    const task = createDeliveryTask({ title: 'Task', goal: 'Goal' })
    const draft = proposal(task)
    const changedTasks = [
      { ...task, id: 'another-task' },
      updateDeliveryTask(task, { title: 'Changed', goal: task.goal }),
      saveDeliveryArtifact(task, 'planning', 'Newer plan'),
      saveDeliveryContextEntry(task, {
        name: 'README',
        content: 'New context',
      }),
    ]
    for (const changed of changedTasks) {
      const original = structuredClone(changed)
      expect(isDeliveryPlanCurrent(changed, draft)).toBe(false)
      expect(() => acceptDeliveryPlan(changed, draft)).toThrow(
        'This draft is outdated.'
      )
      expect(changed).toEqual(original)
    }
    const legacy = { ...task, contextRevision: undefined }
    expect(isDeliveryPlanCurrent(legacy, proposal(legacy))).toBe(true)
    expect(
      acceptDeliveryPlan(legacy, proposal(legacy)).artifacts.planning!
        .contextRevision
    ).toBe(0)
  })

  it.each([
    { objective: ' ' },
    { steps: [' ', ''] },
    { acceptanceCriteria: [] },
  ])('rejects missing required edited fields: %j', (input) => {
    const task = createDeliveryTask({ title: 'Task', goal: 'Goal' })
    expect(() =>
      acceptDeliveryPlan(task, { ...proposal(task), ...input })
    ).toThrow('Enter an objective, steps, and acceptance criteria.')
    expect(task.artifacts).toEqual({})
  })

  it('invalidates validation and approval and returns changed work to planning', () => {
    let task = createDeliveryTask({ title: 'Task', goal: 'Goal' })
    task = saveDeliveryArtifact(task, 'planning', 'Original plan')
    for (const stage of ['discovery', 'planning', 'implementation'] as const)
      task = completeDeliveryTaskStage(task, stage)
    for (const check of task.validationChecks)
      task = recordDeliveryValidationResult(
        task,
        check.id,
        'passed',
        'Actual evidence',
        'manual'
      )
    task = completeDeliveryTaskStage(task, 'validation')
    task = recordDeliveryReviewDecision(task, {
      decision: 'approved',
      reviewer: { id: 'owner', name: 'Owner', source: 'owner' },
    })
    const accepted = acceptDeliveryPlan(task, proposal(task))
    expect(accepted.stage).toBe('planning')
    expect(accepted.revision).toBe(task.revision + 1)
    expect(accepted.workRevision).toBe(task.workRevision + 1)
    expect(accepted.reviewDecisions).toEqual(task.reviewDecisions)
    expect(getDeliveryStageBlocker(accepted, 'validation')).toContain('stale')
    expect(createDeliveryHandoff(accepted).status).toBe('draft')
  })

  it('updates provenance without treating unchanged plan text as new implementation work', () => {
    const task = createDeliveryTask({ title: 'Task', goal: 'Goal' })
    const accepted = acceptDeliveryPlan(task, proposal(task))
    const manual = saveDeliveryArtifact(
      task,
      'planning',
      accepted.artifacts.planning!.content
    )
    const relabeled = acceptDeliveryPlan(manual, proposal(manual))
    expect(relabeled.artifacts.planning!.source).toBe('ai')
    expect(relabeled.workRevision).toBe(manual.workRevision)
    expect(relabeled.revision).toBe(manual.revision + 1)
    expect(acceptDeliveryPlan(relabeled, proposal(relabeled))).toBe(relabeled)
  })
})
