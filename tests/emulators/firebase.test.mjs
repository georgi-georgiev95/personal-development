import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { after, before, beforeEach, test } from 'node:test'
import { initializeApp, deleteApp } from 'firebase/app'
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  deleteUser,
  signOut,
  signInWithEmailAndPassword,
  initializeAuth,
  inMemoryPersistence,
} from 'firebase/auth'
import {
  connectFirestoreEmulator,
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing'

// Refuse standalone execution or remote hosts before any SDK initialization.
assert.equal(process.env.GCLOUD_PROJECT, 'demo-pd-28')
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST, '127.0.0.1:9099')
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8080')

let rules
before(async () => {
  rules = await initializeTestEnvironment({
    projectId: 'demo-pd-28',
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: await readFile('firestore.rules', 'utf8'),
    },
  })
})
beforeEach(async () => {
  await rules.clearFirestore()
})
after(async () => {
  await rules?.cleanup()
})

test('isolated Auth users can write and read their Firestore profile', async () => {
  const app = initializeApp(
    { apiKey: 'demo-api-key', projectId: 'demo-pd-28' },
    'emulator-smoke'
  )
  const auth = initializeAuth(app, { persistence: inMemoryPersistence })
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
  const db = getFirestore(app)
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      `fixture-${crypto.randomUUID()}@example.test`,
      'local-only-password'
    )
    const profile = doc(db, 'users', user.uid)
    await setDoc(profile, { username: 'Emulator fixture' })
    await signOut(auth)
    const login = await signInWithEmailAndPassword(
      auth,
      user.email,
      'local-only-password'
    )
    assert.equal(login.user.uid, user.uid)
    assert.equal((await getDoc(profile)).data().username, 'Emulator fixture')
    await deleteUser(user)
  } finally {
    await deleteApp(app)
  }
})

test('rules allow only the profile owner, and deny anonymous access', async () => {
  const owner = rules.authenticatedContext('fixture-owner').firestore()
  await assertSucceeds(
    setDoc(doc(owner, 'users', 'fixture-owner'), { username: 'Fixture' })
  )
  await assertSucceeds(getDoc(doc(owner, 'users', 'fixture-owner')))
  const other = rules.authenticatedContext('fixture-other').firestore()
  await assertFails(getDoc(doc(other, 'users', 'fixture-owner')))
  await assertFails(
    setDoc(doc(other, 'users', 'fixture-owner'), { username: 'Overwrite' })
  )
  const anonymous = rules.unauthenticatedContext().firestore()
  await assertFails(getDoc(doc(anonymous, 'users', 'fixture-owner')))
  await assertFails(
    setDoc(doc(anonymous, 'users', 'fixture-owner'), { username: 'Anonymous' })
  )
})
