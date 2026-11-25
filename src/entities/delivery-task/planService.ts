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
  request: DeliveryPlanRequest,
  challengeToken?: string
): Promise<DeliveryPlanDraft> {
  const user = auth.currentUser
  if (!user) throw plannerError('Sign in to generate a plan.')
  const token = await user.getIdToken()
  return requestPlan('', request, challengeToken, token)
}

export function generateGuestPlan(
  request: { title: string; goal: string },
  challengeToken?: string
): Promise<DeliveryPlanDraft> {
  return requestPlan('/guest', request, challengeToken)
}

async function requestPlan(
  path: string,
  request: DeliveryPlanRequest | { title: string; goal: string },
  challengeToken?: string,
  firebaseToken?: string
): Promise<DeliveryPlanDraft> {
  if (!plannerUrl) throw plannerError('Planning is not configured.')
  const response = await fetch(`${plannerUrl.replace(/\/$/, '')}${path}`, {
    method: 'POST',
    headers: {
      ...(firebaseToken && { Authorization: `Bearer ${firebaseToken}` }),
      ...(challengeToken && { 'X-Turnstile-Token': challengeToken }),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  const payload = (await response.json().catch(() => null)) as {
    draft?: DeliveryPlanDraft
    error?: string
    resetAt?: string
  } | null
  if (!response.ok || !payload?.draft) {
    if (payload?.error === 'resource-exhausted') {
      const reset = new Date(payload.resetAt ?? '').getTime()
      throw plannerError(
        Number.isFinite(reset)
          ? `Today's AI limit was reached. Try again after ${new Date(reset).toLocaleString()}.`
          : "Today's AI limit was reached. It resets at midnight UTC."
      )
    }
    if (payload?.error === 'rate-limited')
      throw plannerError('Too many requests. Wait a minute and try again.')
    if (payload?.error === 'challenge-required')
      throw plannerError('Complete the verification and try again.')
    if (response.status === 503)
      throw plannerError(
        'AI generation is temporarily unavailable. Try again shortly.'
      )
    throw plannerError(payload?.error ?? 'Could not generate a plan right now.')
  }
  return payload.draft
}
