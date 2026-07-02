import { describe, it, expect } from 'vitest'
import { createSnakeGame } from './createSnakeGame'
import { toggleSnakePause } from './toggleSnakePause'
import type { SnakeGameState, SnakeStatus } from './types'

const gameWithStatus = (status: SnakeStatus): SnakeGameState => ({
  ...createSnakeGame(10, 10, () => 0),
  status,
})

describe('toggleSnakePause', () => {
  it('pauses a running game', () => {
    expect(toggleSnakePause(gameWithStatus('running')).status).toBe('paused')
  })

  it('resumes a paused game', () => {
    expect(toggleSnakePause(gameWithStatus('paused')).status).toBe('running')
  })

  it('leaves an idle game untouched', () => {
    const idle = gameWithStatus('idle')
    expect(toggleSnakePause(idle)).toBe(idle)
  })

  it('leaves a finished game untouched', () => {
    const over = gameWithStatus('game-over')
    expect(toggleSnakePause(over)).toBe(over)
  })
})
