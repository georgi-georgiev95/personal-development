import { auth } from '@/shared/config/firebase/auth'

export interface DeliveryPlanDraft {
  objective: string
  steps: string[]
  acceptanceCriteria: string[]
  risks: string[]
  contextRevision: number
}

export interface DeliveryPlanRequest {
  taskId: string
  contextEntryIds: string[]
  contextRevision: number
}

const productionPlannerUrl = import.meta.env.VITE_AI_PLANNER_URL
const plannerUrl =
  import.meta.env.DEV && import.meta.env.MODE === 'emulator'
    ? 'http://127.0.0.1:8787/plan'
    : productionPlannerUrl

const plannerError = (message: string): Error => new Error(message)

export async function generateDeliveryPlan(
  request: DeliveryPlanRequest
): Promise<DeliveryPlanDraft> {
  const user = auth.currentUser
  if (!user) throw plannerError('Sign in to generate a plan.')
  if (!plannerUrl) throw plannerError('Planning is not configured.')

  const token = await user.getIdToken()
  const response = await fetch(plannerUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  const payload = (await response.json().catch(() => null)) as {
    draft?: DeliveryPlanDraft
    error?: string
  } | null
  if (!response.ok || !payload?.draft) {
    throw plannerError(payload?.error ?? 'Could not generate a plan right now.')
  }
  return payload.draft
}
