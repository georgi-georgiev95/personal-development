import { spawnFood } from './spawnFood'
import type {
  SnakeDirection,
  SnakeGameState,
  SnakePoint,
  SnakeRng,
} from './types'

const DELTA: Record<SnakeDirection, SnakePoint> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

/**
 * Advances the game by one tick: applies the queued direction, moves the
 * snake, and resolves food, wall, and self collisions.
 */
export const stepSnakeGame = (
  state: SnakeGameState,
  rng: SnakeRng = Math.random
): SnakeGameState => {
  if (state.status !== 'running') {
    return state
  }

  const direction = state.nextDirection
  const head = state.snake[0]
  const nextHead: SnakePoint = {
    x: head.x + DELTA[direction].x,
    y: head.y + DELTA[direction].y,
  }

  if (
    nextHead.x < 0 ||
    nextHead.x >= state.cols ||
    nextHead.y < 0 ||
    nextHead.y >= state.rows
  ) {
    return { ...state, direction, status: 'game-over' }
  }

  const eats =
    state.food !== null &&
    nextHead.x === state.food.x &&
    nextHead.y === state.food.y

  // The tail cell frees up this tick unless the snake grows into it, so a
  // non-eating move may safely enter the square the tail is leaving.
  const body = eats ? state.snake : state.snake.slice(0, -1)
  if (body.some((p) => p.x === nextHead.x && p.y === nextHead.y)) {
    return { ...state, direction, status: 'game-over' }
  }

  const snake = [nextHead, ...body]
  if (!eats) {
    return { ...state, direction, snake }
  }

  const food = spawnFood(state.cols, state.rows, snake, rng)
  return {
    ...state,
    direction,
    snake,
    food,
    score: state.score + 1,
    status: food === null ? 'won' : 'running',
  }
}
