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
const request = (token, body = input) =>
  new Request('https://spike.test/plan', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(body),
  })
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
  CLOUDFLARE_ACCOUNT_ID: 'fixture-account',
  CLOUDFLARE_API_TOKEN: 'fixture-only',
  BETA_UIDS: 'owner,other',
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

test('atomic SQL enforces five per UID, 15 globally and UTC reset even with concurrent callers', async () => {
  const store = quota()
  try {
    const reserve = (uid, day = '2026-10-09') =>
      store.prepare(RESERVE_SQL).bind(uid, day).first()
    assert.equal(
      (
        await Promise.all(Array.from({ length: 20 }, () => reserve('owner')))
      ).filter(Boolean).length,
      5
    )
    for (let user = 0; user < 2; user++) {
      assert.equal(
        (
          await Promise.all(
            Array.from({ length: 6 }, () => reserve(`user-${user}`))
          )
        ).filter(Boolean).length,
        5
      )
    }
    assert.equal(await reserve('new-user'), null)
    assert.ok(await reserve('owner', '2026-10-10'))
    assert.equal(
      store.database
        .prepare('SELECT count FROM usage WHERE uid = ?')
        .get('owner').count,
      1
    )
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
    assert.ok(url.endsWith(MODEL))
    const body = JSON.parse(options.body)
    assert.equal(body.max_tokens, 1200)
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
      success: true,
      result: {
        response: JSON.stringify({
          ...draft,
          steps: provider === 'invalid' ? [] : draft.steps,
        }),
      },
    })
  })
  try {
    const token = await sign()
    assert.equal(
      (await worker.fetch(request(undefined), env(store))).status,
      401
    )
    assert.equal(calls.length, 0)
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
    assert.equal(calls.filter((url) => url.includes('/ai/run/')).length, 1)
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
    assert.equal((await worker.fetch(request(token), env(store))).status, 429)
    assert.equal(
      store.database
        .prepare('SELECT count FROM usage WHERE uid = ?')
        .get('owner').count,
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

test('native AI binding needs no account credential and uses the validated model request', async () => {
  const result = await callModel(
    { title: 'Task', goal: 'Goal', contextEntries: [] },
    {
      AI: {
        async run(model, body) {
          assert.equal(model, MODEL)
          assert.deepEqual(body.response_format, { type: 'json_object' })
          assert.equal(body.max_tokens, 1200)
          return { response: JSON.stringify(draft), usage: { neurons: 1 } }
        },
      },
    },
    () => {
      throw Error('REST must not be called')
    }
  )
  assert.deepEqual(result, { draft, usage: { neurons: 1 } })
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
