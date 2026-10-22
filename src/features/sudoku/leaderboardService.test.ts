import { beforeEach, expect, it, vi } from 'vitest'
import { createGame, generatePuzzle } from '@/features/sudoku/sudoku'

const transaction = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }))
vi.mock('@/shared/config/firebase/db', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn((_db, _collection, id) => id),
  collection: vi.fn(),
  getDocs: vi.fn(),
  limit: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  runTransaction: vi.fn(async (_db, execute) => execute(transaction)),
  serverTimestamp: () => 'server timestamp',
  Timestamp: { fromMillis: (value: number) => value },
}))
import { submitScore } from '@/features/sudoku/leaderboardService'

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  transaction.get.mockResolvedValue({ exists: () => false })
})

function completedGame() {
  const game = createGame(generatePuzzle('easy', () => 0.5))
  return {
    ...game,
    entries: game.solution,
    completed: true,
    startedAt: 1000,
    completedAt: 61000,
  }
}

it('submits a completed guest game under a stable identity with calculated points and normalized name', async () => {
  const game = completedGame()
  await submitScore(game, '  Guest   Player  ', null)
  const [id, record] = transaction.set.mock.calls[0]!
  expect(id).toMatch(/^guest_.*_classic_/)
  expect(record).toMatchObject({
    name: 'Guest Player',
    elapsedSeconds: 60,
    mistakes: 0,
    score: 1540,
    day: 0,
  })
  transaction.get.mockResolvedValue({ exists: () => true })
  await submitScore(game, 'Guest Player', null)
  expect(transaction.get.mock.calls[1]![0]).toBe(id)
  expect(transaction.set).toHaveBeenCalledTimes(1)
})

it('uses the signed-in identity and propagates failures for retry', async () => {
  await submitScore(completedGame(), 'Account Player', 'account-id')
  expect(transaction.set.mock.calls[0]![0]).toMatch(/^account-id_classic_/)
  transaction.get.mockRejectedValue(new Error('offline'))
  await expect(
    submitScore(completedGame(), 'Account Player', 'account-id')
  ).rejects.toThrow('offline')
})

it('rejects blank names, incomplete boards, and games that were never timed', async () => {
  const game = completedGame()
  await expect(submitScore(game, ' ', null)).rejects.toThrow('name')
  await expect(
    submitScore({ ...game, entries: game.puzzle }, 'Guest', null)
  ).rejects.toThrow('Finish')
  await expect(
    submitScore({ ...game, startedAt: undefined }, 'Guest', null)
  ).rejects.toThrow('Finish')
  expect(transaction.set).not.toHaveBeenCalled()
})
