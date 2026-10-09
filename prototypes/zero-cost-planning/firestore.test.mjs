import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, setDoc } from 'firebase/firestore'
import { createTokenVerifier, readDocument } from './worker.mjs'

// This file can write fixtures ONLY to the explicitly selected local demo emulators.
assert.equal(process.env.GCLOUD_PROJECT, 'demo-pd-28')
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST, '127.0.0.1:9099')
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8080')

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
