import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing'
import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore'

test('Sudoku guest and account scores are validated, immutable, and publicly ranked', async () => {
  if (process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8080')
    throw new Error('Use only the local Firestore emulator.')
  const environment = await initializeTestEnvironment({
    projectId: 'demo-pd-59-scores-tests',
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      rules: await readFile('firestore.rules', 'utf8'),
    },
  })
  try {
    await environment.clearFirestore()
    const guest = environment.unauthenticatedContext().firestore()
    const account = environment.authenticatedContext('player-one').firestore()
    const guestId = 'guest_11111111-1111-4111-8111-111111111111'
    const puzzle = '123456789'.repeat(9)
    const now = new Date()
    const day = Math.floor(now.getTime() / 86400000)
    const result = (playerId) => ({
      playerId,
      name: 'Test Player',
      puzzle,
      mode: 'classic',
      difficulty: 'easy',
      elapsedSeconds: 60,
      mistakes: 1,
      score: 1440,
      day,
      week: Math.floor((day + 3) / 7),
      month: now.getUTCFullYear() * 12 + now.getUTCMonth(),
      createdAt: serverTimestamp(),
      completedAt: Timestamp.fromDate(now),
    })
    const ref = (db, playerId) =>
      doc(db, 'sudokuScores', `${playerId}_classic_${puzzle}`)
    await assertSucceeds(setDoc(ref(guest, guestId), result(guestId)))
    await assertFails(setDoc(ref(guest, guestId), result(guestId)))
    await assertFails(deleteDoc(ref(guest, guestId)))
    await assertSucceeds(
      setDoc(ref(account, 'player-one'), result('player-one'))
    )
    await assertFails(setDoc(ref(guest, 'player-two'), result('player-two')))
    await assertFails(setDoc(ref(account, 'player-two'), result('player-two')))
    for (const change of [
      { score: 999999 },
      { mistakes: 3 },
      { name: '' },
      { elapsedSeconds: 0 },
      { day: day - 1 },
      { secret: 'not public' },
    ]) {
      const playerId = `guest_${crypto.randomUUID()}`
      await assertFails(
        setDoc(ref(guest, playerId), { ...result(playerId), ...change })
      )
    }
    await assertSucceeds(
      getDocs(query(collection(guest, 'sudokuScores'), limit(20)))
    )
    await assertFails(getDocs(collection(guest, 'sudokuScores')))
  } finally {
    await environment.cleanup()
  }
})
