import { useEffect, useRef, useState } from 'react'
import {
  isDeliveryPlanCurrent,
  type DeliveryPlanProposal,
  type DeliveryTask,
} from '@/entities/delivery-task'
import { Button, Textarea } from '@/shared/ui-kit'
import {
  Actions,
  ArtifactMeta,
  ArtifactPanel,
  Field,
  FieldError,
} from '@/features/ai-delivery-lab/pages/TaskWorkspace.styles'

export function PlanDraftEditor({
  task,
  demo,
  onAccept,
}: {
  task: DeliveryTask
  demo: boolean
  onAccept: (
    id: string,
    draft: DeliveryPlanProposal
  ) => DeliveryTask | null | Promise<DeliveryTask | null>
}) {
  const request = useRef(0)
  const [draft, setDraft] = useState<DeliveryPlanProposal | null>(null)
  const [state, setState] = useState<'idle' | 'generating' | 'saving'>('idle')
  const [error, setError] = useState('')

  useEffect(
    () => () => {
      request.current += 1
    },
    []
  )

  const discard = () => {
    request.current += 1
    setDraft(null)
    setError('')
    setState('idle')
  }
  const generate = async () => {
    const token = ++request.current
    setState('generating')
    setError('')
    try {
      const result = demo
        ? {
            objective: task.goal,
            steps: [
              'Review the task and project context.',
              'Make the smallest change that meets the goal.',
            ],
            acceptanceCriteria: [
              'Verify the outcome against the goal and record actual evidence.',
            ],
            risks: [
              'Fixture response only; no code was changed and no checks were run.',
            ],
            contextRevision: task.contextRevision ?? 0,
          }
        : await (
            await import('@/entities/delivery-task/planService')
          ).generateDeliveryPlan({
            taskId: task.id,
            contextEntryIds: (task.contextEntries ?? []).map(
              (entry) => entry.id
            ),
            contextRevision: task.contextRevision ?? 0,
          })
      if (token !== request.current) return
      const proposal: DeliveryPlanProposal = {
        ...result,
        taskId: task.id,
        taskRevision: task.revision,
        source: demo ? 'demo' : 'ai',
      }
      if (!isDeliveryPlanCurrent(task, proposal))
        throw new Error('This draft is outdated. Generate a new plan.')
      setDraft(proposal)
    } catch (caught) {
      if (token === request.current)
        setError(
          caught instanceof Error
            ? caught.message
            : 'Could not generate a plan. Try again.'
        )
    } finally {
      if (token === request.current) setState('idle')
    }
  }
  const accept = async () => {
    if (!draft || state !== 'idle') return
    setState('saving')
    setError('')
    try {
      const saved = await onAccept(task.id, draft)
      if (!saved) throw new Error('Task is no longer available.')
      discard()
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Could not save the plan. Try again.'
      )
      setState('idle')
    }
  }

  return (
    <ArtifactPanel aria-label="Generate plan">
      <h2>Generate plan</h2>
      <ArtifactMeta>
        {demo
          ? 'Simulated demo · fixture response · no paid AI usage.'
          : 'AI-assisted planning sends the saved task goal and all saved project context to AI.'}{' '}
        Review and edit the draft before accepting. Your saved plan stays
        unchanged until then. No code is implemented and no validation is run.
      </ArtifactMeta>
      {state === 'generating' && (
        <ArtifactMeta role="status">Generating a plan…</ArtifactMeta>
      )}
      {error && <FieldError role="alert">{error}</FieldError>}
      {draft ? (
        <>
          <ArtifactMeta>
            {demo ? 'Simulated demo draft' : 'AI-generated draft'} · Context
            revision {draft.contextRevision} · Not accepted
          </ArtifactMeta>
          {(['objective', 'steps', 'acceptanceCriteria', 'risks'] as const).map(
            (field) => (
              <Field key={field}>
                <label htmlFor={`plan-${field}`}>
                  {field === 'acceptanceCriteria'
                    ? 'Acceptance criteria'
                    : field === 'objective'
                      ? 'Objective'
                      : field === 'steps'
                        ? 'Steps'
                        : 'Risks'}
                  {field !== 'objective' && ' (one per line)'}
                </label>
                <Textarea
                  id={`plan-${field}`}
                  rows={field === 'objective' ? 2 : 4}
                  disabled={state === 'saving'}
                  value={
                    field === 'objective'
                      ? draft.objective
                      : draft[field].join('\n')
                  }
                  onChange={(event) => {
                    setDraft({
                      ...draft,
                      [field]:
                        field === 'objective'
                          ? event.target.value
                          : event.target.value.split('\n'),
                    })
                    setError('')
                  }}
                />
              </Field>
            )
          )}
          <Actions>
            <Button disabled={state === 'saving'} onClick={() => void accept()}>
              {state === 'saving' ? 'Saving…' : 'Accept plan'}
            </Button>
            <Button
              variant="secondary"
              disabled={state === 'saving'}
              onClick={discard}
            >
              Discard draft
            </Button>
          </Actions>
        </>
      ) : (
        <Actions>
          {state === 'generating' ? (
            <Button variant="secondary" onClick={discard}>
              Cancel generation
            </Button>
          ) : (
            <Button onClick={() => void generate()}>
              {error ? 'Retry generation' : 'Generate plan'}
            </Button>
          )}
        </Actions>
      )}
    </ArtifactPanel>
  )
}
