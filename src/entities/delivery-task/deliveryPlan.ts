import {
  DeliveryArtifactInputError,
  saveDeliveryArtifact,
  type DeliveryTask,
} from '@/entities/delivery-task/deliveryTask'
import type { DeliveryPlanDraft } from '@/entities/delivery-task/planService'

export interface DeliveryPlanProposal extends DeliveryPlanDraft {
  taskId: string
  taskRevision: number
  source: 'ai' | 'demo'
}

export const ARTIFACT_SOURCE_LABELS = {
  manual: 'Manual entry',
  ai: 'AI-assisted plan · accepted by owner',
  demo: 'Simulated demo plan · fixture response',
}

export function isDeliveryPlanCurrent(
  task: DeliveryTask,
  draft: DeliveryPlanProposal
): boolean {
  return (
    task.id === draft.taskId &&
    task.revision === draft.taskRevision &&
    (task.contextRevision ?? 0) === draft.contextRevision
  )
}

export function acceptDeliveryPlan(
  task: DeliveryTask,
  draft: DeliveryPlanProposal
): DeliveryTask {
  if (!isDeliveryPlanCurrent(task, draft)) {
    throw new DeliveryArtifactInputError(
      'This draft is outdated. Generate a new plan.'
    )
  }
  const steps = draft.steps.map((line) => line.trim()).filter(Boolean)
  const criteria = draft.acceptanceCriteria
    .map((line) => line.trim())
    .filter(Boolean)
  if (!draft.objective.trim() || !steps.length || !criteria.length) {
    throw new DeliveryArtifactInputError(
      'Enter an objective, steps, and acceptance criteria.'
    )
  }
  const content = [
    `Objective\n${draft.objective.trim()}`,
    `Steps\n${steps.map((line) => `- ${line}`).join('\n')}`,
    `Acceptance criteria\n${criteria.map((line) => `- ${line}`).join('\n')}`,
    `Risks\n${
      draft.risks
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => `- ${line}`)
        .join('\n') || 'None recorded.'
    }`,
  ].join('\n\n')
  return saveDeliveryArtifact(task, 'planning', content, draft.source)
}
