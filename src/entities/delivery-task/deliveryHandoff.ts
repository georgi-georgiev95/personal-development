import {
  DELIVERY_STAGES,
  getDeliveryStageBlocker,
  type DeliveryTask,
} from '@/entities/delivery-task/deliveryTask'
import { ARTIFACT_SOURCE_LABELS } from '@/entities/delivery-task/deliveryPlan'

export interface DeliveryHandoff {
  status: 'ready' | 'draft'
  markdown: string
}

// Keep recorded text literal, including Markdown and embedded code fences.
const literal = (content: string): string => {
  const fence = '`'.repeat(
    Array.from(content.matchAll(/`+/g), ([match]) => match.length).reduce(
      (longest, length) => Math.max(longest, length),
      2
    ) + 1
  )
  return `${fence}text\n${content}\n${fence}`
}

export const createDeliveryHandoff = (task: DeliveryTask): DeliveryHandoff => {
  const blockers = [
    ...new Set(
      [
        getDeliveryStageBlocker(task, 'handoff'),
        getDeliveryStageBlocker(task, 'review'),
      ].filter((blocker): blocker is string => Boolean(blocker))
    ),
  ]
  const status = blockers.length ? 'draft' : 'ready'
  const artifacts = DELIVERY_STAGES.flatMap((stage) => {
    const artifact = Object.values(task.artifacts).find(
      (item) => item.stage === stage
    )
    return artifact
      ? [
          `### ${stage} · ${artifact.kind}`,
          `${ARTIFACT_SOURCE_LABELS[artifact.source]} · Artifact revision ${artifact.revision} · Intent revision ${artifact.taskRevision}${artifact.taskRevision !== task.intentRevision ? ' · Stale intent' : ''}${artifact.contextRevision !== undefined ? ` · Context revision ${artifact.contextRevision}` : ''}`,
          literal(artifact.content),
        ].join('\n\n')
      : []
  })
  const checks = task.validationChecks.map((check) => {
    const evidence = check.evidence
    return [
      `### ${check.name} · Required`,
      `Status: ${check.status}`,
      evidence
        ? `Source: ${evidence.source === 'demo' ? 'Simulated demo; not actual execution' : evidence.source === 'ci' ? 'CI copied manually; not ingested' : 'Manually reported; not run by this product'} · Recorded: ${evidence.recordedAt} · Evidence revision ${evidence.revision} · Task revision ${evidence.taskRevision} · Work revision ${evidence.workRevision}${evidence.workRevision !== task.workRevision ? ' · Stale evidence' : ''}`
        : 'No evidence recorded.',
      evidence ? literal(evidence.note || 'No note or URL recorded.') : '',
    ]
      .filter(Boolean)
      .join('\n\n')
  })
  const decision = task.reviewDecisions.at(-1)
  const review = decision
    ? [
        `Decision: ${decision.decision}${decision.taskRevision !== task.revision ? ' · Stale; review again' : ''}`,
        `Reviewer: ${decision.reviewer.source === 'simulated' ? 'Simulated demo reviewer' : 'Signed-in owner; self-review, not independent review'}`,
        literal(`${decision.reviewer.name} (${decision.reviewer.id})`),
        `Recorded: ${decision.recordedAt} · Reviewed task revision ${decision.taskRevision}`,
        decision.decision === 'changes-requested'
          ? `Return to: ${decision.returnStage}\n\n${literal(decision.reason)}`
          : '',
      ]
        .filter(Boolean)
        .join('\n\n')
    : 'No review decision recorded.'
  const markdown =
    [
      '# Delivery handoff',
      `**${status === 'ready' ? 'READY' : 'DRAFT — incomplete; not ready for handoff'}**`,
      `Task ID: ${task.id} · Task revision ${task.revision} · Work revision ${task.workRevision} · Current stage: ${task.stage}`,
      'This document uses recorded data only. The product did not write code, run checks, verify repository links, or perform AI work beyond explicitly requested plan drafting.',
      '## Task',
      literal(task.title),
      '## Goal',
      literal(task.goal),
      '## Stage artifacts',
      artifacts.join('\n\n') || 'No stage artifacts recorded.',
      '## Validation evidence',
      checks.join('\n\n') || 'No validation checks configured.',
      '## Latest review decision',
      review,
      '## Unresolved blockers',
      blockers.map((blocker) => `- ${blocker}`).join('\n') || 'None recorded.',
      '## Next steps',
      blockers.length
        ? `Resolve the recorded blockers, continue from ${task.stage}, and obtain approval of the current revision.`
        : 'Share this handoff with the next owner. No downstream action has been performed.',
    ].join('\n\n') + '\n'
  return { status, markdown }
}
