import { describe, it, expect } from 'vitest'
import { changeSnakeDirection } from './changeSnakeDirection'
import { createSnakeGame } from './createSnakeGame'
import type { SnakeGameState } from './types'

const runningGame = (): SnakeGameState => ({
  ...createSnakeGame(10, 10, () => 0),
  status: 'running',
})

describe('changeSnakeDirection', () => {
  it('queues a perpendicular direction for the next tick', () => {
    const state = changeSnakeDirection(runningGame(), 'up')
    expect(state.nextDirection).toBe('up')
    expect(state.direction).toBe('right')
  })

  it('ignores a reversal into the neck', () => {
    const state = runningGame()
    expect(changeSnakeDirection(state, 'left')).toBe(state)
  })

  it('checks reversals against the direction actually travelled, not the queued one', () => {
    const queuedUp = changeSnakeDirection(runningGame(), 'up')
    // Still travelling right until the next tick, so 'left' stays a reversal.
    expect(changeSnakeDirection(queuedUp, 'left')).toBe(queuedUp)
    // 'down' is safe: the snake has not actually moved up yet.
    expect(changeSnakeDirection(queuedUp, 'down').nextDirection).toBe('down')
  })

  it('ignores input while the game is not running', () => {
    const idle = createSnakeGame(10, 10, () => 0)
    expect(changeSnakeDirection(idle, 'up')).toBe(idle)
  })
})
