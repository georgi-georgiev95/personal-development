export const SNAKE_BASE_TICK_MS = 160
export const SNAKE_MIN_TICK_MS = 70

const SPEED_UP_PER_POINT_MS = 6

/**
 * Tick length for the current score: starts relaxed and speeds up a few
 * milliseconds per food eaten, clamped to a still-playable minimum.
 */
export const getSnakeTickMs = (score: number): number =>
  Math.max(
    SNAKE_MIN_TICK_MS,
    SNAKE_BASE_TICK_MS - Math.max(0, score) * SPEED_UP_PER_POINT_MS
  )
