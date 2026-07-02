import { describe, it, expect } from 'vitest'
import { createSnakeGame, SNAKE_MIN_GRID } from './createSnakeGame'

describe('createSnakeGame', () => {
  it('creates an idle game with a centred three-segment snake heading right', () => {
    const state = createSnakeGame(10, 8, () => 0)

    expect(state.cols).toBe(10)
    expect(state.rows).toBe(8)
    expect(state.status).toBe('idle')
    expect(state.score).toBe(0)
    expect(state.direction).toBe('right')
    expect(state.nextDirection).toBe('right')
    expect(state.snake).toEqual([
      { x: 5, y: 4 },
      { x: 4, y: 4 },
      { x: 3, y: 4 },
    ])
  })

  it('spawns the first food off the snake', () => {
    const state = createSnakeGame(8, 8, () => 0)
    expect(state.food).not.toBeNull()
    expect(state.snake).not.toContainEqual(state.food)
  })

  it('throws when cols is below the minimum grid size', () => {
    expect(() => createSnakeGame(SNAKE_MIN_GRID - 1, 20)).toThrow(
      /at least 8x8/
    )
  })

  it('throws when rows is below the minimum grid size', () => {
    expect(() => createSnakeGame(20, SNAKE_MIN_GRID - 1)).toThrow(
      /at least 8x8/
    )
  })

  it('uses Math.random by default for the first food', () => {
    const state = createSnakeGame(8, 8)
    expect(state.food).not.toBeNull()
    expect(state.snake).not.toContainEqual(state.food)
  })
})
