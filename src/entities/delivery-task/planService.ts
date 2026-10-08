import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions'
import { app } from '@/shared/config/firebase/firebase'

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

const functions = getFunctions(app, 'europe-west1')

if (import.meta.env.DEV && import.meta.env.MODE === 'emulator') {
  connectFunctionsEmulator(functions, '127.0.0.1', 5001)
}

export async function generateDeliveryPlan(
  request: DeliveryPlanRequest
): Promise<DeliveryPlanDraft> {
  const generatePlan = httpsCallable<DeliveryPlanRequest, DeliveryPlanDraft>(
    functions,
    'generatePlan'
  )
  return (await generatePlan(request)).data
}
