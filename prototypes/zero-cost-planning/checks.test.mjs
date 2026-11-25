import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DatabaseSync } from 'node:sqlite'
import { performance } from 'node:perf_hooks'
import {
  createTokenVerifier,
  createWorker,
  callModel,
  JWKS_URL,
  MODEL,
  modelRequest,
  QUOTA_SCHEMA,
  RESERVE_SQL,
} from './worker.mjs'

const pair = await crypto.subtle.generateKey(
  {
    name: 'RSASSA-PKCS1-v1_5',
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  },
  true,
  ['sign', 'verify']
)
const jwk = {
  ...(await crypto.subtle.exportKey('jwk', pair.publicKey)),
  kid: 'fixture',
}
const now = Math.floor(Date.now() / 1000)
const claims = {
  aud: 'demo-pd-28',
  iss: 'https://securetoken.google.com/demo-pd-28',
  sub: 'owner',
  iat: now - 10,
  auth_time: now - 10,
  exp: now + 3600,
}
const encode = (value) =>
  Buffer.from(JSON.stringify(value)).toString('base64url')
async function sign(overrides = {}, header = { alg: 'RS256', kid: 'fixture' }) {
  const content = `${encode(header)}.${encode({ ...claims, ...overrides })}`
  return `${content}.${Buffer.from(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, new TextEncoder().encode(content))).toString('base64url')}`
}
const keyResponse = () =>
  Response.json(
    { keys: [jwk] },
    { headers: { 'cache-control': 'max-age=3600' } }
  )
const draft = {
  objective: 'Improve onboarding.',
  steps: ['Inspect the route.', 'Implement accessible controls.'],
  acceptanceCriteria: ['A user can start a task.'],
  risks: [],
}
const taskFields = {
  id: { stringValue: 'task-1' },
  title: { stringValue: 'Onboarding' },
  goal: { stringValue: 'Improve onboarding.' },
  contextRevision: { integerValue: '2' },
  contextEntries: {
    arrayValue: {
      values: [
        {
          mapValue: {
            fields: {
              id: { stringValue: 'readme' },
              name: { stringValue: 'README' },
              content: { stringValue: 'Use the existing router.' },
            },
          },
        },
      ],
    },
  },
}
const input = {
  taskId: 'task-1',
  contextEntryIds: ['readme'],
  contextRevision: 2,
}
const siteverify = () =>
  Response.json({
    success: true,
    hostname: 'app.example',
    action: 'generate-plan',
  })
const request = (
  token,
  body = input,
  origin,
  { guest = false, challenge = crypto.randomUUID(), ip = '192.0.2.1' } = {}
) =>
  new Request(
    guest ? 'https://spike.test/plan/guest' : 'https://spike.test/plan',
    {
      method: 'POST',
      headers: {
        'CF-Connecting-IP': ip,
        ...(challenge ? { 'X-Turnstile-Token': challenge } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(origin ? { Origin: origin } : {}),
      },
      body: JSON.stringify(body),
    }
  )
function quota() {
  const database = new DatabaseSync(':memory:')
  database.exec(QUOTA_SCHEMA)
  return {
    database,
    prepare: (sql) => ({
      bind: (...args) => ({
        first: async () => database.prepare(sql).get(...args) ?? null,
      }),
    }),
  }
}
const env = (store) => ({
  FREE_PLAN_CONFIRMED: 'true',
  FIREBASE_PROJECT_ID: 'demo-pd-28',
  GROQ_API_KEY: 'fixture-only',
  TURNSTILE_SECRET_KEY: 'fixture-only',
  TURNSTILE_HOSTNAME: 'app.example',
  PLAN_RATE_LIMIT: { limit: async () => ({ success: true }) },
  QUOTA: store,
})

test('RS256 verification rejects forged, expired, wrong-project and invalid-claim tokens; keys are cached', async () => {
  let calls = 0
  const verify = createTokenVerifier(async (url) => {
    assert.equal(url, JWKS_URL)
    calls++
    return keyResponse()
  })
  const valid = await sign()
  const start = performance.now()
  assert.equal(await verify(valid, 'demo-pd-28'), 'owner')
  assert.equal(await verify(valid, 'demo-pd-28'), 'owner')
  const twoVerificationsWallMs = Number((performance.now() - start).toFixed(2))
  assert.equal(calls, 1)
  for (const token of [
    undefined,
    'garbage',
    valid.replace(valid.split('.')[1], encode({ ...claims, sub: 'victim' })),
    await sign({ exp: now - 1 }),
    await sign({ aud: 'other-project' }),
    await sign({ iss: 'https://evil.test' }),
    await sign({ iat: now + 3600 }),
    await sign({ auth_time: now + 3600 }),
    await sign({ sub: '' }),
    await sign({}, { alg: 'none', kid: 'fixture' }),
    await sign({}, { alg: 'RS256', kid: 'unknown' }),
  ]) {
    await assert.rejects(verify(token, 'demo-pd-28'), {
      code: 'unauthenticated',
    })
  }
  console.log(
    JSON.stringify({
      check: 'local-rs256',
      twoVerificationsWallMs,
      runtime: process.version,
      workersCpu: 'not measured',
    })
  )
})

test('atomic SQL enforces 100 shared calls and prevents token reuse across midnight', async () => {
  const store = quota()
  try {
    const reserve = (token, day = '2026-10-09') =>
      store.prepare(RESERVE_SQL).bind(day, `:${token}:`).first()
    assert.ok(await reserve('first'))
    assert.equal(await reserve('first'), null)
    assert.equal(await reserve('first', '2026-10-10'), null)
    assert.equal(
      (
        await Promise.all(Array.from({ length: 120 }, (_, i) => reserve(i)))
      ).filter(Boolean).length,
      99
    )
    assert.equal(await reserve('blocked'), null)
    assert.equal((await reserve('next-day', '2026-10-10')).count, 1)
  } finally {
    store.database.close()
  }
})

test('guest inference requires verification, respects burst limits, and shares the global cap', async () => {
  const store = quota()
  const runtime = env(store)
  let modelCalls = 0
  let challengeResult = siteverify
  const worker = createWorker(async (url) => {
    if (url.includes('/siteverify')) return challengeResult()
    assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions')
    modelCalls++
    return Response.json({
      choices: [{ message: { content: JSON.stringify(draft) } }],
    })
  })
  const guest = (challenge) =>
    request(
      undefined,
      {
        title: 'Onboarding',
        goal: 'Improve onboarding.',
      },
      undefined,
      { guest: true, challenge }
    )
  try {
    assert.equal((await worker.fetch(guest(null), runtime)).status, 403)
    challengeResult = () =>
      Response.json({
        success: true,
        hostname: 'wrong.example',
        action: 'generate-plan',
      })
    assert.equal((await worker.fetch(guest(), runtime)).status, 403)
    challengeResult = () =>
      Response.json({
        success: true,
        hostname: 'app.example',
        action: 'other-action',
      })
    assert.equal((await worker.fetch(guest(), runtime)).status, 403)
    challengeResult = siteverify
    const limited = await worker.fetch(guest(), {
      ...runtime,
      PLAN_RATE_LIMIT: { limit: async () => ({ success: false }) },
    })
    assert.equal(limited.status, 429)
    assert.deepEqual(await limited.json(), { error: 'rate-limited' })
    assert.equal(modelCalls, 0)
    assert.equal((await worker.fetch(guest('fresh'), runtime)).status, 200)
    assert.equal((await worker.fetch(guest('fresh'), runtime)).status, 403)
    store.database.prepare('UPDATE planner_usage SET count = ?').run(100)
    const exhausted = await worker.fetch(guest(), runtime)
    assert.equal(exhausted.status, 429)
    const result = await exhausted.json()
    assert.equal(result.error, 'resource-exhausted')
    assert.match(result.resetAt, /T00:00:00.000Z$/)
    assert.equal(modelCalls, 1)
  } finally {
    store.database.close()
  }
})

test('full handler scopes REST reads to the verified owner, validates drafts and counts provider failures', async () => {
  const store = quota()
  const calls = []
  let provider = 'valid'
  const worker = createWorker(async (url, options) => {
    calls.push(url)
    if (url === JWKS_URL) return keyResponse()
    if (url.includes('/siteverify')) return siteverify()
    if (url.includes('firestore.googleapis.com')) {
      assert.equal(
        options.headers.Authorization,
        `Bearer ${await sign(url.includes('/workspaces/other') ? { sub: 'other' } : {})}`
      )
      if (url.endsWith('/workspaces/owner'))
        return Response.json({ fields: { ownerUid: { stringValue: 'owner' } } })
      if (url.endsWith('/workspaces/owner/tasks/task-1'))
        return Response.json({ fields: taskFields })
      return new Response('', { status: 403 })
    }
    assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions')
    const body = JSON.parse(options.body)
    assert.equal(body.model, MODEL)
    assert.equal(body.max_tokens, 400)
    assert.equal(
      body.messages[1].content,
      JSON.stringify({
        task: { title: 'Onboarding', goal: 'Improve onboarding.' },
        projectContext: [
          { name: 'README', content: 'Use the existing router.' },
        ],
      })
    )
    if (provider === 'error')
      return new Response('private failure', { status: 429 })
    return Response.json({
      choices: [
        {
          message: {
            content: JSON.stringify({
              ...draft,
              steps: provider === 'invalid' ? [] : draft.steps,
            }),
          },
        },
      ],
    })
  })
  try {
    const token = await sign()
    assert.equal(
      (await worker.fetch(request(undefined), env(store))).status,
      401
    )
    assert.deepEqual(calls, [
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    ])
    const valid = await worker.fetch(request(token), env(store))
    assert.equal(valid.status, 200)
    assert.deepEqual(await valid.json(), {
      draft: { ...draft, contextRevision: 2 },
    })
    const other = await worker.fetch(
      request(await sign({ sub: 'other' })),
      env(store)
    )
    assert.equal(other.status, 404)
    assert.equal(
      calls.filter(
        (url) => url === 'https://api.groq.com/openai/v1/chat/completions'
      ).length,
      1
    )
    assert.equal(
      (
        await worker.fetch(
          request(token, { ...input, contextRevision: 1 }),
          env(store)
        )
      ).status,
      409
    )
    assert.equal(
      (
        await worker.fetch(
          request(token, { ...input, padding: 'x'.repeat(8192) }),
          env(store)
        )
      ).status,
      400
    )
    provider = 'invalid'
    assert.equal((await worker.fetch(request(token), env(store))).status, 503)
    provider = 'error'
    for (let attempt = 0; attempt < 3; attempt++)
      assert.equal((await worker.fetch(request(token), env(store))).status, 503)
    assert.equal(
      store.database.prepare('SELECT count FROM planner_usage').get().count,
      5
    )
    assert.equal(
      (
        await worker.fetch(request(token), {
          ...env(store),
          QUOTA: {
            prepare() {
              throw Error('storage limit')
            },
          },
        })
      ).status,
      503
    )
    assert.equal(
      (
        await worker.fetch(request(token), {
          ...env(store),
          FREE_PLAN_CONFIRMED: 'false',
        })
      ).status,
      503
    )
  } finally {
    store.database.close()
  }
})

test('Groq calls use the validated model request', async () => {
  const result = await callModel(
    { title: 'Task', goal: 'Goal', contextEntries: [] },
    { GROQ_API_KEY: 'fixture-only' },
    async (url, options) => {
      assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions')
      assert.equal(JSON.parse(options.body).model, MODEL)
      return Response.json({
        choices: [{ message: { content: JSON.stringify(draft) } }],
      })
    }
  )
  assert.deepEqual(result, draft)
})

test('provider timeout becomes a controlled deadline error', async () => {
  await assert.rejects(
    callModel(
      { title: 'Task', goal: 'Goal', contextEntries: [] },
      { GROQ_API_KEY: 'fixture-only' },
      async () => {
        const error = new Error('provider timeout')
        error.name = 'TimeoutError'
        throw error
      }
    ),
    { code: 'deadline-exceeded' }
  )
})

test('CORS preflight and response use the configured allowed origin', async () => {
  const store = quota()
  const calls = []
  const worker = createWorker(async (url, options) => {
    calls.push(url)
    if (url === JWKS_URL) return keyResponse()
    if (url.includes('/siteverify')) return siteverify()
    if (url.endsWith('/workspaces/owner'))
      return Response.json({ fields: { ownerUid: { stringValue: 'owner' } } })
    if (url.endsWith('/workspaces/owner/tasks/task-1'))
      return Response.json({ fields: taskFields })
    return Response.json({
      choices: [{ message: { content: JSON.stringify(draft) } }],
    })
  })
  const runtime = {
    ...env(store),
    CORS_ORIGINS: 'https://app.example',
  }
  try {
    const token = await sign()
    const preflight = await worker.fetch(
      new Request('https://spike.test/plan', {
        method: 'OPTIONS',
        headers: { Origin: 'https://app.example' },
      }),
      runtime
    )
    assert.equal(preflight.status, 204)
    assert.equal(
      preflight.headers.get('Access-Control-Allow-Origin'),
      'https://app.example'
    )

    const response = await worker.fetch(
      request(token, input, 'https://app.example'),
      runtime
    )
    assert.equal(response.status, 200)
    assert.deepEqual((await response.json()).draft, {
      ...draft,
      contextRevision: 2,
    })
    assert.equal(
      response.headers.get('Access-Control-Allow-Origin'),
      'https://app.example'
    )
    assert.equal(
      calls.filter(
        (url) => url === 'https://api.groq.com/openai/v1/chat/completions'
      ).length,
      1
    )

    const disallowed = await worker.fetch(
      request(token, input, 'https://evil.example'),
      runtime
    )
    assert.equal(disallowed.status, 403)
    assert.equal(disallowed.headers.get('Access-Control-Allow-Origin'), null)
  } finally {
    store.database.close()
  }
})

test('input byte ceiling includes multilingual text and system prompt', () => {
  assert.ok(modelRequest({ title: 'Task', goal: 'Goal', contextEntries: [] }))
  assert.throws(
    () =>
      modelRequest({
        title: 'Task',
        goal: 'Goal',
        contextEntries: [{ name: 'Large', content: '界'.repeat(6000) }],
      }),
    { code: 'invalid-argument' }
  )
})
