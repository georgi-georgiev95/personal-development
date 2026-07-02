import type { SnakeGameState } from './types'

/** Pauses a running game or resumes a paused one; no-op for other statuses. */
export const toggleSnakePause = (state: SnakeGameState): SnakeGameState => {
  if (state.status === 'running') {
    return { ...state, status: 'paused' }
  }
  if (state.status === 'paused') {
    return { ...state, status: 'running' }
  }
  return state
}
