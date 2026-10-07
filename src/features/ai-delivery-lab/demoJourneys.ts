import {
  completeDeliveryTaskStage,
  createDeliveryTask,
  recordDeliveryReviewDecision,
  saveDeliveryArtifact,
  type DeliveryTask,
} from '@/entities/delivery-task'

export type DemoJourney = 'successful' | 'changes-requested'

export function createDemoJourney(journey: DemoJourney): DeliveryTask {
  let task = createDeliveryTask({
    title:
      journey === 'successful'
        ? 'Successful journey template'
        : 'Changes-requested journey template',
    goal: 'Practice a delivery handoff with your own work and validation evidence.',
  })
  for (const stage of ['discovery', 'planning', 'implementation'] as const) {
    task = saveDeliveryArtifact(
      task,
      stage,
      `Sample ${stage} notes — replace these with your own recorded work. This demo has not changed code or run checks.`
    )
    task = completeDeliveryTaskStage(task, stage)
  }
  if (journey === 'successful') return task
  // A simulated reviewer can request changes with missing checks, never approve them.
  return recordDeliveryReviewDecision(
    { ...task, stage: 'review' },
    {
      decision: 'changes-requested',
      reviewer: {
        id: 'demo-reviewer',
        name: 'Demo reviewer',
        source: 'simulated',
      },
      reason:
        'Replace the sample implementation notes with actual work, then record real validation evidence.',
      returnStage: 'implementation',
    }
  )
}
