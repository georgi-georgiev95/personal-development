import { spawnFood } from './spawnFood'
import type { SnakeGameState, SnakePoint, SnakeRng } from './types'

/** Smallest playable grid — anything below leaves no room to manoeuvre. */
export const SNAKE_MIN_GRID = 8

const INITIAL_LENGTH = 3

/**
 * Builds a fresh idle game: a three-segment snake resting in the middle of
 * the grid, heading right, with the first food already on the board.
 */
export const createSnakeGame = (
  cols: number,
  rows: number,
  rng: SnakeRng = Math.random
): SnakeGameState => {
  if (cols < SNAKE_MIN_GRID || rows < SNAKE_MIN_GRID) {
    throw new Error(
      `Snake grid must be at least ${SNAKE_MIN_GRID}x${SNAKE_MIN_GRID}`
    )
  }
  const headX = Math.floor(cols / 2)
  const headY = Math.floor(rows / 2)
  const snake: SnakePoint[] = Array.from(
    { length: INITIAL_LENGTH },
    (_, segment) => ({ x: headX - segment, y: headY })
  )
  return {
    cols,
    rows,
    snake,
    direction: 'right',
    nextDirection: 'right',
    food: spawnFood(cols, rows, snake, rng),
    score: 0,
    status: 'idle',
  }
}
