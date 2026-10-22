import { describe, expect, it } from 'vitest'
import {
  calculateScore,
  periodBuckets,
  elapsedSeconds,
  formatTime,
} from './scores'

describe('Sudoku scoring', () => {
  it('rewards difficulty and speed and deducts mistakes without going below 100', () => {
    expect(calculateScore('easy', 60, 0)).toBe(1540)
    expect(calculateScore('medium', 60, 1)).toBe(2440)
    expect(calculateScore('hard', 900, 2)).toBe(2800)
    expect(calculateScore('easy', 99999, 20)).toBe(100)
  })
  it('uses UTC dates and Monday weeks across month and year boundaries', () => {
    expect(periodBuckets(new Date('2026-01-01T23:59:59Z'))).toEqual({
      day: 20454,
      week: 2922,
      month: 24312,
    })
    expect(periodBuckets(new Date('2026-01-04T23:59:59Z')).week).toBe(2922)
    expect(periodBuckets(new Date('2026-01-05T00:00:00Z')).week).toBe(2923)
  })
  it('freezes time at completion and formats long games', () => {
    expect(
      elapsedSeconds({ startedAt: 1000, completedAt: 61000 }, 100000)
    ).toBe(60)
    expect(elapsedSeconds({ startedAt: 1000 }, 61000)).toBe(60)
    expect(elapsedSeconds({}, 100000)).toBe(0)
    expect(formatTime(3661)).toBe('61:01')
  })
})
