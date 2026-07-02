export { createSnakeGame, SNAKE_MIN_GRID } from './createSnakeGame'
export { changeSnakeDirection } from './changeSnakeDirection'
export { startSnakeGame } from './startSnakeGame'
export { toggleSnakePause } from './toggleSnakePause'
export { stepSnakeGame } from './stepSnakeGame'
export { spawnFood } from './spawnFood'
export {
  getSnakeTickMs,
  SNAKE_BASE_TICK_MS,
  SNAKE_MIN_TICK_MS,
} from './getSnakeTickMs'
export { loadSnakeHighScore, saveSnakeHighScore } from './highScore'
export type {
  SnakeDirection,
  SnakeGameState,
  SnakePoint,
  SnakeRng,
  SnakeStatus,
} from './types'
