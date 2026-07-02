import { describe, it, expect } from 'vitest'
import { createSnakeGame } from './createSnakeGame'
import { startSnakeGame } from './startSnakeGame'
import type { SnakeGameState } from './types'

describe('startSnakeGame', () => {
  it('moves an idle game to running', () => {
    const state = startSnakeGame(createSnakeGame(10, 10, () => 0))
    expect(state.status).toBe('running')
  })

  it('leaves a non-idle game untouched', () => {
    const gameOver: SnakeGameState = {
      ...createSnakeGame(10, 10, () => 0),
      status: 'game-over',
    }
    expect(startSnakeGame(gameOver)).toBe(gameOver)
  })
})
