import { describe, expect, it } from 'vitest'
import { createDemoJourney } from '@/features/ai-delivery-lab/demoJourneys'
import { createDeliveryHandoff } from '@/entities/delivery-task'

describe('demo journey templates', () => {
  it('seeds a successful path awaiting real evidence and approval', () => {
    const task = createDemoJourney('successful')
    expect(task.stage).toBe('validation')
    expect(task.reviewDecisions).toEqual([])
    expect(
      task.validationChecks.every(
        (check) => check.status === 'pending' && !check.evidence
      )
    ).toBe(true)
    expect(createDeliveryHandoff(task).status).toBe('draft')
  })
  it('seeds simulated requested changes without inventing passing validation', () => {
    const task = createDemoJourney('changes-requested')
    expect(task.stage).toBe('implementation')
    expect(task.reviewDecisions[0]).toMatchObject({
      decision: 'changes-requested',
      reviewer: { source: 'simulated' },
    })
    expect(task.validationChecks.every((check) => !check.evidence)).toBe(true)
    expect(createDeliveryHandoff(task).status).toBe('draft')
  })
})
