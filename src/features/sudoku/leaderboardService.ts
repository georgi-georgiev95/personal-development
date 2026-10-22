import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore'
import { db } from '@/shared/config/firebase/db'
import {
  calculateScore,
  elapsedSeconds,
  periodBuckets,
  type RankingPeriod,
} from '@/features/sudoku/scores'
import {
  isSolved,
  type Game,
  type Difficulty,
  type SudokuMode,
} from '@/features/sudoku/sudoku'

export interface ScoreRow {
  name: string
  score: number
  difficulty: Difficulty
  elapsedSeconds: number
  mistakes: number
}

let memoryGuestId: string | undefined
function guestId(): string {
  try {
    const saved = localStorage.getItem('daywise.sudoku.guest')
    if (saved && /^guest_[a-f0-9-]{36}$/.test(saved)) return saved
    const id = (memoryGuestId ??= `guest_${crypto.randomUUID()}`)
    localStorage.setItem('daywise.sudoku.guest', id)
    return id
  } catch {
    return (memoryGuestId ??= `guest_${crypto.randomUUID()}`)
  }
}

export async function submitScore(
  game: Game,
  name: string,
  uid: string | null
): Promise<void> {
  const publicName = name.trim().replace(/\s+/g, ' ')
  if (
    publicName.length < 2 ||
    publicName.length > 24 ||
    Array.from(publicName).some((character) => character.charCodeAt(0) < 32)
  )
    throw new Error('Use a name between 2 and 24 characters.')
  if (
    !game.completed ||
    !isSolved(game) ||
    game.mistakes >= 3 ||
    game.startedAt === undefined ||
    game.completedAt === undefined
  )
    throw new Error('Finish a new game before saving a score.')
  const seconds = Math.max(1, elapsedSeconds(game, game.completedAt))
  const playerId = uid ?? guestId()
  const puzzle = game.puzzle.join('')
  const ref = doc(db, 'sudokuScores', `${playerId}_${game.mode}_${puzzle}`)
  await runTransaction(db, async (transaction) => {
    if ((await transaction.get(ref)).exists()) return
    transaction.set(ref, {
      playerId,
      name: publicName,
      puzzle,
      mode: game.mode,
      difficulty: game.difficulty,
      elapsedSeconds: seconds,
      mistakes: game.mistakes,
      score: calculateScore(game.difficulty, seconds, game.mistakes),
      ...periodBuckets(new Date(game.completedAt!)),
      completedAt: Timestamp.fromMillis(game.completedAt!),
      createdAt: serverTimestamp(),
    })
  })
}

export async function loadLeaderboard(
  mode: SudokuMode,
  period: RankingPeriod
): Promise<ScoreRow[]> {
  const constraints = [where('mode', '==', mode)]
  if (period !== 'all')
    constraints.push(where(period, '==', periodBuckets(new Date())[period]))
  const snapshot = await getDocs(
    query(
      collection(db, 'sudokuScores'),
      ...constraints,
      orderBy('score', 'desc'),
      orderBy('elapsedSeconds', 'asc'),
      limit(20)
    )
  )
  return snapshot.docs.map((row) => row.data() as ScoreRow)
}
