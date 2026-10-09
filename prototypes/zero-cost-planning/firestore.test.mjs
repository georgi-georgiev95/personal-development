import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { DatabaseSync } from 'node:sqlite'
import { test } from 'node:test'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, setDoc } from 'firebase/firestore'
import {
  createTokenVerifier,
  createWorker,
  QUOTA_SCHEMA,
  readDocument,
  RESERVE_SQL,
} from './worker.mjs'

// This file can write fixtures ONLY to the explicitly selected local demo emulators.
assert.equal(process.env.GCLOUD_PROJECT, 'demo-pd-28')
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST, '127.0.0.1:9099')
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8080')

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

test('REST reads with Auth emulator tokens obey unchanged owner rules; Worker rejects unsigned tokens', async () => {
  const rules = await initializeTestEnvironment({
    projectId: 'demo-pd-28',
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: await readFile('firestore.rules', 'utf8'),
    },
  })
  try {
    const users = []
    for (let index = 0; index < 2; index++) {
      const response = await fetch(
        'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `pd36-${crypto.randomUUID()}@example.test`,
            password: 'local-only-password',
            returnSecureToken: true,
          }),
        }
      )
      assert.equal(response.status, 200)
      users.push(await response.json())
    }
    const [owner, other] = users
    await rules.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'workspaces', owner.localId), {
        ownerUid: owner.localId,
      })
      await setDoc(
        doc(
          context.firestore(),
          'workspaces',
          owner.localId,
          'tasks',
          'pd36-fixture'
        ),
        {
          id: 'pd36-fixture',
          title: 'Fixture',
          goal: 'Verify REST ownership.',
          contextRevision: 0,
        }
      )
    })
    const localFetcher = (url, options) => {
      assert.ok(
        url.startsWith(
          'https://firestore.googleapis.com/v1/projects/demo-pd-28/'
        )
      )
      return fetch(
        url.replace(
          'https://firestore.googleapis.com',
          'http://127.0.0.1:8080'
        ),
        options
      )
    }
    const path = ['workspaces', owner.localId, 'tasks', 'pd36-fixture']
    assert.equal(
      (await readDocument('demo-pd-28', path, owner.idToken, localFetcher))
        .title,
      'Fixture'
    )
    assert.equal(
      await readDocument('demo-pd-28', path, other.idToken, localFetcher),
      null
    )
    assert.equal(
      await readDocument(
        'demo-pd-28',
        ['workspaces', other.localId, 'tasks', 'pd36-fixture'],
        other.idToken,
        localFetcher
      ),
      null
    )
    const verify = createTokenVerifier(() => {
      throw Error('Unsigned emulator tokens must not reach Google.')
    })
    await assert.rejects(verify(owner.idToken, 'demo-pd-28'), {
      code: 'unauthenticated',
    })
  } finally {
    await rules.cleanup()
  }
})

test('deterministic Worker endpoint reads the owner task from the Firestore emulator', async () => {
  const rules = await initializeTestEnvironment({
    projectId: 'demo-pd-28',
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: await readFile('firestore.rules', 'utf8'),
    },
  })
  const store = quota()
  try {
    const response = await fetch(
      'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `pd41-${crypto.randomUUID()}@example.test`,
          password: 'local-only-password',
          returnSecureToken: true,
        }),
      }
    )
    assert.equal(response.status, 200)
    const owner = await response.json()
    await rules.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'workspaces', owner.localId), {
        ownerUid: owner.localId,
      })
      await setDoc(
        doc(
          context.firestore(),
          'workspaces',
          owner.localId,
          'tasks',
          'pd41-fixture'
        ),
        {
          id: 'pd41-fixture',
          title: 'Fixture task',
          goal: 'Verify the free runtime endpoint.',
          contextRevision: 0,
        }
      )
    })

    const localFetcher = (url, options) =>
      fetch(
        url.replace(
          'https://firestore.googleapis.com',
          'http://127.0.0.1:8080'
        ),
        options
      )
    const worker = createWorker(localFetcher, async (token) => {
      assert.equal(token, owner.idToken)
      return owner.localId
    })
    const result = await worker.fetch(
      new Request('https://pd41.test/plan', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${owner.idToken}`,
          Origin: 'https://app.example',
        },
        body: JSON.stringify({
          taskId: 'pd41-fixture',
          contextEntryIds: [],
          contextRevision: 0,
        }),
      }),
      {
        PLANNING_MODE: 'deterministic',
        FREE_PLAN_CONFIRMED: 'true',
        FIREBASE_PROJECT_ID: 'demo-pd-28',
        BETA_UIDS: owner.localId,
        CORS_ORIGINS: 'https://app.example',
        QUOTA: store,
      }
    )
    assert.equal(result.status, 200)
    assert.deepEqual((await result.json()).draft, {
      objective: 'Verify the free runtime endpoint.',
      steps: [
        'Review the existing Fixture task flow.',
        'Implement and verify the requested change.',
      ],
      acceptanceCriteria: ['The requested planning behavior is available.'],
      risks: [],
      contextRevision: 0,
    })
  } finally {
    store.database.close()
    await rules.cleanup()
  }
})
