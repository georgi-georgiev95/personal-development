import { getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'
import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import {
  generatePlanDraft,
  PLAN_DAILY_LIMIT,
  PlannerError,
} from './planning.js'
import type { PlanningTask } from './planning.js'
import { generateOpenAIPlan } from './openAIProvider.js'

if (getApps().length === 0) initializeApp()

const database = getFirestore()
const openAIKey = defineSecret('OPENAI_API_KEY')

async function loadOwnedTask(
  uid: string,
  taskId: string
): Promise<PlanningTask | null> {
  const workspace = await database.doc(`workspaces/${uid}`).get()
  if (!workspace.exists || workspace.data()?.ownerUid !== uid) return null

  const task = await database.doc(`workspaces/${uid}/tasks/${taskId}`).get()
  if (!task.exists) return null
  return task.data() as PlanningTask
}

async function reserveUsage(uid: string, date: string): Promise<boolean> {
  const usage = database.doc(`aiPlanningUsage/${uid}`)
  return database.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(usage)
    const current = snapshot.data()
    const count = current?.date === date ? Number(current.count) || 0 : 0
    if (count >= PLAN_DAILY_LIMIT) return false
    transaction.set(usage, {
      date,
      count: count + 1,
      updatedAt: Timestamp.now(),
    })
    return true
  })
}

const generate = (input: Parameters<typeof generateOpenAIPlan>[0]) => {
  if (
    process.env.FUNCTIONS_EMULATOR === 'true' &&
    process.env.AI_PLANNER_MOCK_PROVIDER === 'true'
  ) {
    return Promise.resolve({
      objective: `${input.goal} (${input.contextEntries.map(({ name }) => name).join(', ')})`,
      steps: ['Inspect the relevant code.', 'Implement and verify the change.'],
      acceptanceCriteria: ['The requested behavior is implemented.'],
      risks: [],
    })
  }
  return generateOpenAIPlan(input, openAIKey.value())
}

export const generatePlan = onCall(
  {
    region: 'europe-west1',
    timeoutSeconds: 30,
    maxInstances: 3,
    concurrency: 1,
    memory: '256MiB',
    secrets: [openAIKey],
  },
  async (request) => {
    try {
      return await generatePlanDraft(request.data, request.auth?.uid, {
        loadTask: loadOwnedTask,
        reserveUsage,
        generate,
      })
    } catch (error) {
      if (error instanceof PlannerError) {
        throw new HttpsError(error.code, error.message)
      }
      throw new HttpsError('internal', 'Could not generate a plan right now.')
    }
  }
)
