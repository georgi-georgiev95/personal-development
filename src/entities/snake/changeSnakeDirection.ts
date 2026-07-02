import type { SnakeDirection, SnakeGameState } from './types'

const OPPOSITE: Record<SnakeDirection, SnakeDirection> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

/**
 * Queues a direction for the next tick. Reversing straight into the neck is
 * ignored, and the check runs against the direction actually travelled last
 * tick (`direction`, not `nextDirection`) so two quick inputs inside one
 * tick cannot fold the snake onto itself.
 */
export const changeSnakeDirection = (
  state: SnakeGameState,
  direction: SnakeDirection
): SnakeGameState => {
  if (state.status !== 'running' || direction === OPPOSITE[state.direction]) {
    return state
  }
  return { ...state, nextDirection: direction }
}
