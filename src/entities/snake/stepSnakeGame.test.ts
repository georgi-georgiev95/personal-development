import { describe, it, expect } from 'vitest'
import { stepSnakeGame } from './stepSnakeGame'
import type { SnakeGameState } from './types'

const baseState = (overrides: Partial<SnakeGameState>): SnakeGameState => ({
  cols: 10,
  rows: 10,
  snake: [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ],
  direction: 'right',
  nextDirection: 'right',
  food: { x: 9, y: 9 },
  score: 0,
  status: 'running',
  ...overrides,
})

describe('stepSnakeGame', () => {
  it('does nothing unless the game is running', () => {
    const idle = baseState({ status: 'idle' })
    const paused = baseState({ status: 'paused' })
    expect(stepSnakeGame(idle, () => 0)).toBe(idle)
    expect(stepSnakeGame(paused, () => 0)).toBe(paused)
  })

  it('moves the snake one cell without growing', () => {
    const state = stepSnakeGame(baseState({}), () => 0)
    expect(state.snake).toEqual([
      { x: 6, y: 5 },
      { x: 5, y: 5 },
      { x: 4, y: 5 },
    ])
    expect(state.score).toBe(0)
    expect(state.status).toBe('running')
  })

  it('applies the queued direction on the tick', () => {
    const state = stepSnakeGame(baseState({ nextDirection: 'up' }), () => 0)
    expect(state.direction).toBe('up')
    expect(state.snake[0]).toEqual({ x: 5, y: 4 })
  })

  it('ends the game on the right wall', () => {
    const atEdge = baseState({
      snake: [
        { x: 9, y: 5 },
        { x: 8, y: 5 },
      ],
    })
    expect(stepSnakeGame(atEdge, () => 0).status).toBe('game-over')
  })

  it('ends the game on the left wall', () => {
    const atEdge = baseState({
      snake: [
        { x: 0, y: 5 },
        { x: 1, y: 5 },
      ],
      direction: 'left',
      nextDirection: 'left',
    })
    expect(stepSnakeGame(atEdge, () => 0).status).toBe('game-over')
  })

  it('ends the game on the top wall', () => {
    const atEdge = baseState({
      snake: [
        { x: 5, y: 0 },
        { x: 5, y: 1 },
      ],
      direction: 'up',
      nextDirection: 'up',
    })
    expect(stepSnakeGame(atEdge, () => 0).status).toBe('game-over')
  })

  it('ends the game on the bottom wall', () => {
    const atEdge = baseState({
      snake: [
        { x: 5, y: 9 },
        { x: 5, y: 8 },
      ],
      direction: 'down',
      nextDirection: 'down',
    })
    expect(stepSnakeGame(atEdge, () => 0).status).toBe('game-over')
  })

  it('ends the game when the head hits the body', () => {
    // Hook shape: turning left drives the head into a mid-body segment.
    const hooked = baseState({
      snake: [
        { x: 5, y: 5 },
        { x: 5, y: 4 },
        { x: 4, y: 4 },
        { x: 4, y: 5 },
        { x: 4, y: 6 },
      ],
      direction: 'down',
      nextDirection: 'left',
    })
    expect(stepSnakeGame(hooked, () => 0).status).toBe('game-over')
  })

  it('allows moving into the cell the tail is vacating', () => {
    // Closed 2x2 loop: the head chases the tail into the square it frees up.
    const loop = baseState({
      snake: [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 4, y: 4 },
        { x: 5, y: 4 },
      ],
      direction: 'right',
      nextDirection: 'up',
    })
    const state = stepSnakeGame(loop, () => 0)
    expect(state.status).toBe('running')
    expect(state.snake[0]).toEqual({ x: 5, y: 4 })
  })

  it('grows, scores, and respawns food when eating', () => {
    const aboutToEat = baseState({ food: { x: 6, y: 5 } })
    const state = stepSnakeGame(aboutToEat, () => 0)
    expect(state.snake).toHaveLength(4)
    expect(state.snake[0]).toEqual({ x: 6, y: 5 })
    expect(state.score).toBe(1)
    expect(state.status).toBe('running')
    expect(state.food).not.toBeNull()
    expect(state.snake).not.toContainEqual(state.food)
  })

  it('wins the game when the snake fills the board', () => {
    const nearlyFull: SnakeGameState = {
      cols: 2,
      rows: 2,
      snake: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ],
      direction: 'down',
      nextDirection: 'down',
      food: { x: 0, y: 1 },
      score: 1,
      status: 'running',
    }
    const state = stepSnakeGame(nearlyFull, () => 0)
    expect(state.status).toBe('won')
    expect(state.food).toBeNull()
    expect(state.snake).toHaveLength(4)
    expect(state.score).toBe(2)
  })

  it('keeps moving normally when there is no food on the board', () => {
    const state = stepSnakeGame(baseState({ food: null }), () => 0)
    expect(state.status).toBe('running')
    expect(state.snake).toHaveLength(3)
  })

  it('uses Math.random by default when respawning food', () => {
    const aboutToEat = baseState({ food: { x: 6, y: 5 } })
    const state = stepSnakeGame(aboutToEat)
    expect(state.score).toBe(1)
    expect(state.food).not.toBeNull()
    expect(state.snake).not.toContainEqual(state.food)
  })
})
