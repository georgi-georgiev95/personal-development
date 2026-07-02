import { describe, it, expect } from 'vitest'
import {
  getSnakeTickMs,
  SNAKE_BASE_TICK_MS,
  SNAKE_MIN_TICK_MS,
} from './getSnakeTickMs'

describe('getSnakeTickMs', () => {
  it('starts at the base tick for a fresh game', () => {
    expect(getSnakeTickMs(0)).toBe(SNAKE_BASE_TICK_MS)
  })

  it('speeds up as the score grows', () => {
    expect(getSnakeTickMs(5)).toBeLessThan(getSnakeTickMs(1))
  })

  it('never drops below the minimum tick', () => {
    expect(getSnakeTickMs(1000)).toBe(SNAKE_MIN_TICK_MS)
  })

  it('treats a negative score as zero', () => {
    expect(getSnakeTickMs(-3)).toBe(SNAKE_BASE_TICK_MS)
  })
})
