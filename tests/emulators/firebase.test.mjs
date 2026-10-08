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
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
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

test('personal workspace initialization is stable and idempotent', async () => {
  const app = initializeApp(
    { apiKey: 'demo-api-key', projectId: 'demo-pd-28' },
    'workspace-concurrency'
  )
  const auth = initializeAuth(app, { persistence: inMemoryPersistence })
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
  const db = getFirestore(app)
  connectFirestoreEmulator(db, '127.0.0.1', 8080)

  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      `workspace-${crypto.randomUUID()}@example.test`,
      'local-only-password'
    )
    const workspaceRef = doc(db, 'workspaces', user.uid)

    await Promise.all(
      Array.from({ length: 4 }, () =>
        runTransaction(db, async (transaction) => {
          const workspace = await transaction.get(workspaceRef)
          if (!workspace.exists()) {
            transaction.set(workspaceRef, {
              ownerUid: user.uid,
              createdAt: serverTimestamp(),
            })
          }
        })
      )
    )

    assert.equal((await getDoc(workspaceRef)).data().ownerUid, user.uid)
    await rules.withSecurityRulesDisabled(async (context) => {
      const workspaces = await getDocs(
        collection(context.firestore(), 'workspaces')
      )
      assert.equal(workspaces.size, 1)
    })
    await deleteUser(user)
  } finally {
    await deleteApp(app)
  }
})

test('workspace rules enforce private immutable ownership and deny listing', async () => {
  const owner = rules.authenticatedContext('workspace-owner').firestore()
  const workspaceRef = doc(owner, 'workspaces', 'workspace-owner')
  await assertSucceeds(
    setDoc(workspaceRef, {
      ownerUid: 'workspace-owner',
      createdAt: serverTimestamp(),
    })
  )
  await assertSucceeds(getDoc(workspaceRef))
  await assertFails(updateDoc(workspaceRef, { ownerUid: 'workspace-other' }))
  await assertFails(deleteDoc(workspaceRef))
  await assertFails(getDocs(collection(owner, 'workspaces')))

  const other = rules.authenticatedContext('workspace-other').firestore()
  await assertFails(getDoc(doc(other, 'workspaces', 'workspace-owner')))
  await assertFails(
    setDoc(doc(other, 'workspaces', 'workspace-owner'), {
      ownerUid: 'workspace-other',
      createdAt: serverTimestamp(),
    })
  )
  await assertFails(
    updateDoc(doc(other, 'workspaces', 'workspace-owner'), {
      ownerUid: 'workspace-other',
    })
  )
  await assertFails(getDocs(collection(other, 'workspaces')))

  const anonymous = rules.unauthenticatedContext().firestore()
  await assertFails(getDoc(doc(anonymous, 'workspaces', 'workspace-owner')))
  await assertFails(
    setDoc(doc(anonymous, 'workspaces', 'workspace-anonymous'), {
      ownerUid: 'workspace-anonymous',
      createdAt: serverTimestamp(),
    })
  )
  await assertFails(getDocs(collection(anonymous, 'workspaces')))
})
