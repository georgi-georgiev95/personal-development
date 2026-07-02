export interface SnakePoint {
  x: number
  y: number
}

export type SnakeDirection = 'up' | 'down' | 'left' | 'right'

export type SnakeStatus = 'idle' | 'running' | 'paused' | 'game-over' | 'won'

export interface SnakeGameState {
  cols: number
  rows: number
  /** Snake segments, head first, tail last. */
  snake: SnakePoint[]
  /** Direction the snake travelled on the last tick. */
  direction: SnakeDirection
  /** Direction queued for the next tick; see `changeSnakeDirection`. */
  nextDirection: SnakeDirection
  /** Current food cell, or null when the snake fills the board. */
  food: SnakePoint | null
  score: number
  status: SnakeStatus
}

/** Random source in [0, 1) — injectable so game logic stays deterministic in tests. */
export type SnakeRng = () => number
