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
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions'
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

const deliveryTaskFixture = (id = 'task-stable-id') => {
  const now = new Date().toISOString()
  return {
    id,
    title: 'Private delivery task',
    goal: 'Persist its progress safely',
    stage: 'discovery',
    persistenceRevision: 1,
    intentRevision: 1,
    revision: 1,
    workRevision: 1,
    artifacts: {},
    contextEntries: [],
    contextRevision: 0,
    validationChecks: [
      ['typecheck', 'Typecheck'],
      ['lint', 'Lint'],
      ['coverage', 'Coverage'],
      ['build-performance', 'Build and performance'],
    ].map(([checkId, name]) => ({
      id: checkId,
      name,
      required: true,
      status: 'pending',
      history: [],
      revision: 0,
      updatedAt: now,
    })),
    reviewDecisions: [],
    createdAt: now,
    updatedAt: now,
  }
}

test('private delivery tasks persist for their owner and reject other users or invalid data', async () => {
  const ownerUid = 'task-owner'
  const owner = rules.authenticatedContext(ownerUid).firestore()
  const workspaceRef = doc(owner, 'workspaces', ownerUid)
  await assertSucceeds(
    setDoc(workspaceRef, {
      ownerUid,
      createdAt: serverTimestamp(),
    })
  )

  const taskRef = doc(owner, 'workspaces', ownerUid, 'tasks', 'task-stable-id')
  const task = deliveryTaskFixture()
  await assertSucceeds(setDoc(taskRef, task))
  await assertFails(setDoc(taskRef, task)) // stale direct retry cannot overwrite
  await assertSucceeds(getDoc(taskRef))
  await assertSucceeds(
    getDocs(collection(owner, 'workspaces', ownerUid, 'tasks'))
  )
  await assertSucceeds(
    updateDoc(taskRef, {
      stage: 'planning',
      revision: 2,
      persistenceRevision: 2,
    })
  )
  assert.equal((await getDoc(taskRef)).data().stage, 'planning')

  await assert.rejects(
    runTransaction(owner, async (transaction) => {
      const snapshot = await transaction.get(taskRef)
      if (snapshot.data().persistenceRevision !== 1) {
        throw new Error('Task changed in another tab.')
      }
      transaction.set(taskRef, {
        ...snapshot.data(),
        title: 'Stale approval overwrote newer work',
        persistenceRevision: 3,
      })
    }),
    /Task changed in another tab/
  )
  assert.equal((await getDoc(taskRef)).data().persistenceRevision, 2)

  const artifactTime = new Date().toISOString()
  await assertSucceeds(
    updateDoc(taskRef, {
      artifacts: {
        discovery: {
          stage: 'discovery',
          kind: 'discovery-notes',
          content: 'Saved discovery notes',
          source: 'manual',
          revision: 1,
          taskRevision: 1,
          createdAt: artifactTime,
          updatedAt: artifactTime,
        },
        planning: {
          stage: 'planning',
          kind: 'plan',
          content: 'Accepted AI plan',
          source: 'ai',
          revision: 1,
          taskRevision: 1,
          contextRevision: 0,
          createdAt: artifactTime,
          updatedAt: artifactTime,
        },
      },
      persistenceRevision: 3,
    })
  )

  await assertFails(
    updateDoc(taskRef, {
      artifacts: {
        discovery: {
          stage: 'discovery',
          kind: 'plan',
          content: 'Malformed artifact',
          source: 'manual',
          revision: 2,
          taskRevision: 1,
          createdAt: artifactTime,
          updatedAt: artifactTime,
        },
      },
      persistenceRevision: 4,
    })
  )

  await assertFails(
    updateDoc(taskRef, {
      artifacts: {
        discovery: {
          stage: 'discovery',
          kind: 'discovery-notes',
          content: 'Simulated evidence',
          source: 'demo',
          revision: 2,
          taskRevision: 1,
          createdAt: artifactTime,
          updatedAt: artifactTime,
        },
      },
      persistenceRevision: 4,
    })
  )

  const evidence = {
    status: 'passed',
    note: 'Verified with the local emulator',
    source: 'manual',
    recordedAt: artifactTime,
    taskRevision: 1,
    workRevision: 1,
    revision: 1,
  }
  const savedChecks = (await getDoc(taskRef)).data().validationChecks
  savedChecks[0] = {
    ...savedChecks[0],
    status: 'passed',
    evidence,
    history: [evidence],
    revision: 1,
    updatedAt: artifactTime,
  }
  const simulatedChecks = savedChecks.map((check) => ({ ...check }))
  simulatedChecks[0] = {
    ...simulatedChecks[0],
    evidence: { ...evidence, source: 'demo' },
  }
  await assertFails(
    updateDoc(taskRef, {
      stage: 'validation',
      validationChecks: simulatedChecks,
      persistenceRevision: 4,
    })
  )
  const malformedChecks = savedChecks.map((check) => ({ ...check }))
  malformedChecks[0] = { ...malformedChecks[0], name: 'Malformed check' }
  await assertFails(
    updateDoc(taskRef, {
      stage: 'validation',
      validationChecks: malformedChecks,
      persistenceRevision: 4,
    })
  )
  await assertSucceeds(
    updateDoc(taskRef, {
      stage: 'validation',
      validationChecks: savedChecks,
      persistenceRevision: 4,
    })
  )

  await assertSucceeds(
    updateDoc(taskRef, {
      stage: 'handoff',
      reviewDecisions: [
        {
          decision: 'approved',
          reviewer: { id: ownerUid, name: 'Task owner', source: 'owner' },
          taskRevision: 1,
          recordedAt: artifactTime,
        },
      ],
      persistenceRevision: 5,
    })
  )

  const restoredTask = (await getDoc(taskRef)).data()
  assert.equal(restoredTask.persistenceRevision, 5)
  assert.equal(
    restoredTask.artifacts.discovery.content,
    'Saved discovery notes'
  )
  assert.equal(restoredTask.artifacts.planning.source, 'ai')
  assert.equal(
    restoredTask.validationChecks[0].evidence.note,
    'Verified with the local emulator'
  )
  assert.equal(restoredTask.reviewDecisions[0].decision, 'approved')

  const savedContext = {
    id: 'readme-context',
    name: 'README excerpt',
    content: 'Local project facts',
    revision: 1,
    createdAt: artifactTime,
    updatedAt: artifactTime,
  }
  await assertSucceeds(
    updateDoc(taskRef, {
      contextEntries: [savedContext],
      contextRevision: 1,
      persistenceRevision: 6,
    })
  )
  const taskWithContext = (await getDoc(taskRef)).data()
  assert.equal(taskWithContext.contextEntries[0].name, 'README excerpt')
  assert.equal(taskWithContext.contextRevision, 1)
  const tooManyContexts = Array.from({ length: 6 }, (_, index) => ({
    ...savedContext,
    id: `context-${index}`,
    name: `Context ${index}`,
  }))
  await assertFails(
    updateDoc(taskRef, {
      contextEntries: tooManyContexts,
      contextRevision: 2,
      persistenceRevision: 7,
    })
  )
  assert.equal((await getDoc(taskRef)).data().contextRevision, 1)

  await assertFails(
    updateDoc(taskRef, {
      reviewDecisions: [
        {
          decision: 'approved',
          reviewer: {
            id: 'another-user',
            name: 'Another user',
            source: 'owner',
          },
          taskRevision: 1,
          recordedAt: artifactTime,
        },
      ],
      persistenceRevision: 7,
    })
  )
  assert.equal((await getDoc(taskRef)).data().persistenceRevision, 6)

  const other = rules.authenticatedContext('other-task-user').firestore()
  await assertFails(
    getDoc(doc(other, 'workspaces', ownerUid, 'tasks', task.id))
  )
  await assertFails(getDocs(collection(other, 'workspaces', ownerUid, 'tasks')))
  await assertFails(
    updateDoc(doc(other, 'workspaces', ownerUid, 'tasks', task.id), {
      stage: 'handoff',
    })
  )

  const anonymous = rules.unauthenticatedContext().firestore()
  await assertFails(
    getDoc(doc(anonymous, 'workspaces', ownerUid, 'tasks', task.id))
  )
  await assertFails(
    setDoc(doc(owner, 'workspaces', ownerUid, 'tasks', 'invalid-stage'), {
      ...deliveryTaskFixture('invalid-stage'),
      stage: 'unknown',
    })
  )
  await assertFails(
    setDoc(
      doc(owner, 'workspaces', ownerUid, 'tasks', 'mismatched-id'),
      deliveryTaskFixture('different-document-id')
    )
  )
  await assertFails(
    setDoc(doc(owner, 'workspaces', ownerUid, 'tasks', 'simulated-review'), {
      ...deliveryTaskFixture('simulated-review'),
      reviewDecisions: [
        {
          decision: 'approved',
          reviewer: { id: 'demo', name: 'Demo reviewer', source: 'simulated' },
          taskRevision: 1,
          recordedAt: new Date().toISOString(),
        },
      ],
    })
  )
  await assertFails(
    setDoc(doc(owner, 'workspaces', ownerUid, 'tasks', 'impersonated-review'), {
      ...deliveryTaskFixture('impersonated-review'),
      reviewDecisions: [
        {
          decision: 'approved',
          reviewer: {
            id: 'another-user',
            name: 'Another user',
            source: 'owner',
          },
          taskRevision: 1,
          recordedAt: new Date().toISOString(),
        },
      ],
    })
  )
  const invalidEvidenceTask = deliveryTaskFixture('invalid-evidence')
  invalidEvidenceTask.validationChecks[0] = {
    ...invalidEvidenceTask.validationChecks[0],
    status: 'passed',
    evidence: {
      status: 'passed',
      note: '',
      source: 'manual',
      recordedAt: new Date().toISOString(),
      taskRevision: 1,
      workRevision: 1,
      revision: 1,
    },
  }
  await assertFails(
    setDoc(
      doc(owner, 'workspaces', ownerUid, 'tasks', 'invalid-evidence'),
      invalidEvidenceTask
    )
  )
  await assertSucceeds(
    setDoc(doc(owner, 'workspaces', ownerUid, 'tasks', 'owner-review'), {
      ...deliveryTaskFixture('owner-review'),
      stage: 'handoff',
      reviewDecisions: [
        {
          decision: 'approved',
          reviewer: { id: ownerUid, name: 'Task owner', source: 'owner' },
          taskRevision: 1,
          recordedAt: new Date().toISOString(),
        },
      ],
    })
  )

  await rules.withSecurityRulesDisabled(async (context) => {
    const saved = await getDocs(
      collection(context.firestore(), 'workspaces', ownerUid, 'tasks')
    )
    assert.equal(saved.size, 2)
    assert.equal(
      saved.docs.some((item) => item.id === task.id),
      true
    )
    assert.equal(
      saved.docs.some((item) => item.id === 'owner-review'),
      true
    )
  })
})

test('authenticated plan generation is owner-scoped, context-versioned, mocked, and rate-limited', async () => {
  const app = initializeApp(
    { apiKey: 'demo-api-key', projectId: 'demo-pd-28' },
    'planning-endpoint-emulator'
  )
  const auth = initializeAuth(app, { persistence: inMemoryPersistence })
  connectAuthEmulator(auth, 'http://127.0.0.1:9099')
  const db = getFirestore(app)
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  const functions = getFunctions(app, 'europe-west1')
  connectFunctionsEmulator(functions, '127.0.0.1', 5001)
  const call = httpsCallable(functions, 'generatePlan')

  try {
    await assert.rejects(
      call({ taskId: 'plan-task', contextEntryIds: [], contextRevision: 1 }),
      (error) => error.code === 'functions/unauthenticated'
    )

    const { user: owner } = await createUserWithEmailAndPassword(
      auth,
      `planner-owner-${crypto.randomUUID()}@example.test`,
      'local-only-password'
    )
    const workspaceRef = doc(db, 'workspaces', owner.uid)
    await setDoc(workspaceRef, {
      ownerUid: owner.uid,
      createdAt: serverTimestamp(),
    })
    const taskRef = doc(db, 'workspaces', owner.uid, 'tasks', 'plan-task')
    const contextTime = new Date().toISOString()
    await setDoc(taskRef, deliveryTaskFixture('plan-task'))
    await updateDoc(taskRef, {
      title: 'Improve onboarding',
      goal: 'Make first use clear.',
      contextRevision: 1,
      persistenceRevision: 2,
      updatedAt: contextTime,
      contextEntries: [
        {
          id: 'readme-context',
          name: 'README',
          content: 'Use the current route structure.',
          revision: 1,
          createdAt: contextTime,
          updatedAt: contextTime,
        },
        {
          id: 'agents-context',
          name: 'AGENTS',
          content: 'Use accessible controls.',
          revision: 1,
          createdAt: contextTime,
          updatedAt: contextTime,
        },
      ],
    })

    const response = await call({
      taskId: 'plan-task',
      contextEntryIds: ['agents-context'],
      contextRevision: 1,
    })
    assert.deepEqual(response.data, {
      objective: 'Make first use clear. (AGENTS)',
      steps: ['Inspect the relevant code.', 'Implement and verify the change.'],
      acceptanceCriteria: ['The requested behavior is implemented.'],
      risks: [],
      contextRevision: 1,
    })

    await assert.rejects(
      call({ taskId: 'plan-task', contextEntryIds: [], contextRevision: 0 }),
      (error) => error.code === 'functions/failed-precondition'
    )

    await signOut(auth)
    const { user: other } = await createUserWithEmailAndPassword(
      auth,
      `planner-other-${crypto.randomUUID()}@example.test`,
      'local-only-password'
    )
    await assert.rejects(
      call({
        taskId: 'plan-task',
        contextEntryIds: ['agents-context'],
        contextRevision: 1,
      }),
      (error) => error.code === 'functions/not-found'
    )
    await rules.withSecurityRulesDisabled(async (context) => {
      const usage = await getDoc(
        doc(context.firestore(), 'aiPlanningUsage', other.uid)
      )
      assert.equal(usage.exists(), false)
    })

    await signOut(auth)
    await signInWithEmailAndPassword(auth, owner.email, 'local-only-password')
    for (let request = 1; request < 5; request += 1) {
      await call({
        taskId: 'plan-task',
        contextEntryIds: [],
        contextRevision: 1,
      })
    }
    await assert.rejects(
      call({ taskId: 'plan-task', contextEntryIds: [], contextRevision: 1 }),
      (error) => error.code === 'functions/resource-exhausted'
    )
    await deleteUser(auth.currentUser)
  } finally {
    await deleteApp(app)
  }
})
