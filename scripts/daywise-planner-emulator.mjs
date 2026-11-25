import { createServer } from 'node:http'
import { Readable } from 'node:stream'
import { DatabaseSync } from 'node:sqlite'
import {
  createWorker,
  QUOTA_SCHEMA,
} from '../prototypes/zero-cost-planning/worker.mjs'
import { PlannerError } from '../prototypes/zero-cost-planning/planning.mjs'

const project = 'demo-pd-28'
const origin = 'http://127.0.0.1:5175'
const database = new DatabaseSync(':memory:')
database.exec(QUOTA_SCHEMA)

const env = {
  FREE_PLAN_CONFIRMED: 'true',
  FIREBASE_PROJECT_ID: project,
  GROQ_API_KEY: 'local-fixture',
  TURNSTILE_SECRET_KEY: 'local-fixture',
  TURNSTILE_HOSTNAME: '127.0.0.1',
  CORS_ORIGINS: origin,
  PLAN_RATE_LIMIT: { limit: async () => ({ success: true }) },
  QUOTA: {
    prepare: (sql) => ({
      bind: (...params) => ({
        first: async () => database.prepare(sql).get(...params) ?? null,
      }),
    }),
  },
}

async function emulatorFetch(url, options) {
  if (url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
    return Response.json({
      success: /^local-[a-f0-9-]{36}$/.test(options.body.get('response') ?? ''),
      hostname: env.TURNSTILE_HOSTNAME,
      action: 'generate-plan',
    })
  }
  if (url === 'https://api.groq.com/openai/v1/chat/completions') {
    const { messages } = JSON.parse(options.body)
    const { task } = JSON.parse(messages[1].content)
    const draft = {
      objective: task.goal.slice(0, 500),
      steps: ['Write down what you need.', 'Pick one small step to try.'],
      acceptanceCriteria: ['You can tell whether the first step helped.'],
      risks: [],
    }
    return Response.json({
      choices: [{ message: { content: JSON.stringify(draft) } }],
    })
  }
  const firestore = `https://firestore.googleapis.com/v1/projects/${project}/`
  if (!url.startsWith(firestore)) throw new Error('Unexpected emulator URL.')
  return fetch(
    url.replace('https://firestore.googleapis.com', 'http://127.0.0.1:8080'),
    options
  )
}

async function verifyEmulatorUser(token) {
  if (token) {
    const response = await fetch(
      'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:lookup?key=demo-api-key',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
        signal: AbortSignal.timeout(5_000),
      }
    )
    if (response.ok) {
      const { users } = await response.json()
      if (users?.[0]?.localId) return users[0].localId
    }
  }
  throw new PlannerError('unauthenticated', 'An emulator account is required.')
}

const worker = createWorker(emulatorFetch, verifyEmulatorUser)
createServer(async (incoming, outgoing) => {
  try {
    const headers = new Headers(incoming.headers)
    headers.set('CF-Connecting-IP', '127.0.0.1')
    const hasBody = incoming.method === 'POST'
    const request = new Request(
      new URL(incoming.url, 'http://127.0.0.1:8787'),
      {
        method: incoming.method,
        headers,
        ...(hasBody && { body: Readable.toWeb(incoming), duplex: 'half' }),
      }
    )
    const response = await worker.fetch(request, env)
    outgoing.writeHead(response.status, Object.fromEntries(response.headers))
    outgoing.end(await response.text())
  } catch {
    outgoing.writeHead(500).end()
  }
}).listen(8787, '127.0.0.1', () => {
  console.log('Local planner fixture ready on http://127.0.0.1:8787/plan')
})
