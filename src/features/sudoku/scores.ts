import type { Difficulty } from '@/features/sudoku/sudoku'

export type RankingPeriod = 'day' | 'week' | 'month' | 'all'

export function calculateScore(
  difficulty: Difficulty,
  seconds: number,
  mistakes: number
): number {
  const base = { easy: 1000, medium: 2000, hard: 3000 }[difficulty]
  return Math.max(100, base + Math.max(0, 600 - seconds) - mistakes * 100)
}

export function periodBuckets(date: Date): {
  day: number
  week: number
  month: number
} {
  const day = Math.floor(date.getTime() / 86_400_000)
  return {
    day,
    week: Math.floor((day + 3) / 7),
    month: date.getUTCFullYear() * 12 + date.getUTCMonth(),
  }
}

export function elapsedSeconds(
  game: { startedAt?: number; completedAt?: number },
  now: number
): number {
  return game.startedAt === undefined
    ? 0
    : Math.max(
        0,
        Math.floor(((game.completedAt ?? now) - game.startedAt) / 1000)
      )
}

export function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
