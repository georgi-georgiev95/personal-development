import type { SnakeGameState } from './types'

/** Starts an idle game; any other status is returned unchanged. */
export const startSnakeGame = (state: SnakeGameState): SnakeGameState =>
  state.status === 'idle' ? { ...state, status: 'running' } : state
