import { describe, expect, it } from 'vitest'
import { createDeliveryHandoff } from '@/entities/delivery-task/deliveryHandoff'
import {
  completeDeliveryTaskStage,
  createDeliveryTask,
  recordDeliveryReviewDecision,
  recordDeliveryValidationResult,
  reopenDeliveryTaskStage,
  REQUIRED_VALIDATION_CHECKS,
  saveDeliveryArtifact,
  updateDeliveryTask,
  type DeliveryTask,
} from '@/entities/delivery-task/deliveryTask'

function reviewedTask(): DeliveryTask {
  let task = createDeliveryTask({
    title: 'Задача 🚀',
    goal: 'First line\nВтора линия',
  })
  for (const stage of ['discovery', 'planning', 'implementation'] as const) {
    task = completeDeliveryTaskStage(task, stage)
  }
  for (const check of REQUIRED_VALIDATION_CHECKS) {
    task = recordDeliveryValidationResult(
      task,
      check.id,
      'passed',
      'Recorded log\nMore evidence',
      'ci'
    )
  }
  return completeDeliveryTaskStage(task, 'validation')
}

const reviewer = {
  id: 'demo-reviewer',
  name: 'Demo reviewer',
  source: 'simulated' as const,
}

describe('createDeliveryHandoff', () => {
  it('exports an honest deterministic draft for an incomplete task', () => {
    const task = createDeliveryTask({ title: 'Draft', goal: 'Goal' })
    const original = structuredClone(task)
    const handoff = createDeliveryHandoff(task)
    expect(handoff.status).toBe('draft')
    expect(handoff.markdown).toContain(
      'DRAFT — incomplete; not ready for handoff'
    )
    expect(handoff.markdown).toContain('No stage artifacts recorded.')
    expect(handoff.markdown).toContain('No evidence recorded.')
    expect(handoff.markdown).toContain('No review decision recorded.')
    expect(handoff.markdown).toContain('Typecheck has not been run.')
    expect(handoff.markdown).toContain(
      'did not write code, run checks, verify repository links, or perform AI work'
    )
    expect(handoff.markdown).toContain('continue from discovery')
    expect(createDeliveryHandoff(task)).toEqual(handoff)
    expect(task).toEqual(original)
  })

  it('exports ready only after current validation and approval; preserves Unicode and literal multiline artifacts', () => {
    const content = '# Literal heading\n```ts\nconst x = "✓"\n```\nEnd'
    const reviewing = saveDeliveryArtifact(reviewedTask(), 'review', content)
    const task = recordDeliveryReviewDecision(reviewing, {
      decision: 'approved',
      reviewer,
    })
    const handoff = createDeliveryHandoff(task)
    expect(handoff.status).toBe('ready')
    expect(handoff.markdown).toContain('**READY**')
    expect(handoff.markdown).toContain('Задача 🚀')
    expect(handoff.markdown).toContain('First line\nВтора линия')
    expect(handoff.markdown).toContain(`\`\`\`\`text\n${content}\n\`\`\`\``)
    expect(handoff.markdown).toContain('CI copied manually; not ingested')
    expect(handoff.markdown).toContain('Recorded log\nMore evidence')
    expect(handoff.markdown).toContain('Simulated demo reviewer')
    expect(handoff.markdown).toContain(
      `Reviewed task revision ${task.revision}`
    )
    expect(handoff.markdown).toContain(
      '## Unresolved blockers\n\nNone recorded.'
    )
    expect(handoff.markdown).toContain(
      'Share this handoff with the next owner.'
    )
    expect(
      createDeliveryHandoff(reopenDeliveryTaskStage(task, 'review')).status
    ).toBe('draft')
  })

  it('exports requested changes and stale approvals as drafts with recorded next steps', () => {
    const requested = recordDeliveryReviewDecision(reviewedTask(), {
      decision: 'changes-requested',
      reviewer,
      reason: 'Fix scope\nKeep it small',
      returnStage: 'planning',
    })
    const draft = createDeliveryHandoff(requested)
    expect(draft.status).toBe('draft')
    expect(draft.markdown).toContain('Decision: changes-requested')
    expect(draft.markdown).toContain('Return to: planning')
    expect(draft.markdown).toContain('Fix scope\nKeep it small')
    expect(draft.markdown).toContain('Changes were requested.')
    expect(draft.markdown).toContain('continue from planning')
    const withNotes = saveDeliveryArtifact(
      reviewedTask(),
      'review',
      'Owner notes'
    )
    const approved = recordDeliveryReviewDecision(withNotes, {
      decision: 'approved',
      reviewer: { id: 'owner', name: 'Owner', source: 'owner' },
    })
    const revised = updateDeliveryTask(approved, {
      title: approved.title,
      goal: 'Changed goal',
    })
    const stale = createDeliveryHandoff(revised)
    expect(stale.status).toBe('draft')
    expect(stale.markdown).toContain('Stale; review again')
    expect(stale.markdown).toContain('Stale intent')
    expect(stale.markdown).toContain('Stale evidence')
    expect(stale.markdown).toContain(
      'Signed-in owner; self-review, not independent review'
    )
  })

  it('labels failed, manually reported, and simulated evidence without treating it as actual execution', () => {
    const reviewing = reviewedTask()
    const validation = reopenDeliveryTaskStage(reviewing, 'validation')
    const failed = recordDeliveryValidationResult(
      validation,
      'lint',
      'failed',
      '',
      'manual'
    )
    expect(createDeliveryHandoff(failed).markdown).toContain('Status: failed')
    expect(createDeliveryHandoff(failed).markdown).toContain(
      'Manually reported; not run by this product'
    )
    expect(createDeliveryHandoff(failed).markdown).toContain(
      'No note or URL recorded.'
    )
    const simulated = {
      ...reviewing,
      stage: 'handoff' as const,
      validationChecks: reviewing.validationChecks.map((check) => ({
        ...check,
        evidence: { ...check.evidence!, source: 'demo' as const },
      })),
    }
    expect(createDeliveryHandoff(simulated).status).toBe('draft')
    expect(createDeliveryHandoff(simulated).markdown).toContain(
      'Simulated demo; not actual execution'
    )
    const noChecks = { ...reviewing, validationChecks: [] }
    expect(createDeliveryHandoff(noChecks).markdown).toContain(
      'No validation checks configured.'
    )
    expect(createDeliveryHandoff(noChecks).status).toBe('draft')
  })
})
