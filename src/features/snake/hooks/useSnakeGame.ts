import { useCallback, useEffect, useState } from 'react'
import {
  changeSnakeDirection,
  createSnakeGame,
  getSnakeTickMs,
  loadSnakeHighScore,
  saveSnakeHighScore,
  startSnakeGame,
  stepSnakeGame,
  toggleSnakePause,
} from '@/entities/snake'
import type { SnakeDirection, SnakeGameState } from '@/entities/snake'

export const SNAKE_COLS = 16
export const SNAKE_ROWS = 16

const KEY_DIRECTIONS: Record<string, SnakeDirection> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right',
}

const isFinished = (state: SnakeGameState): boolean =>
  state.status === 'game-over' || state.status === 'won'

export interface UseSnakeGame {
  game: SnakeGameState
  best: number
  start: () => void
  restart: () => void
  togglePause: () => void
  steer: (direction: SnakeDirection) => void
}

/**
 * Owns the snake game state and its inputs. The loop runs on
 * requestAnimationFrame only while the game is running, so an idle, paused,
 * or finished game costs nothing per frame — and a hidden tab auto-pauses.
 */
export const useSnakeGame = (): UseSnakeGame => {
  const [game, setGame] = useState<SnakeGameState>(() =>
    createSnakeGame(SNAKE_COLS, SNAKE_ROWS)
  )

  const [best, setBest] = useState<number>(() => loadSnakeHighScore())
  // "Adjusting state during render": a finished run beating the best score
  // updates it right away; persistence happens in the effect below.
  if (isFinished(game) && game.score > best) {
    setBest(game.score)
  }

  const start = useCallback(() => {
    setGame((prev) => startSnakeGame(prev))
  }, [])

  const restart = useCallback(() => {
    setGame(startSnakeGame(createSnakeGame(SNAKE_COLS, SNAKE_ROWS)))
  }, [])

  const togglePause = useCallback(() => {
    setGame((prev) => toggleSnakePause(prev))
  }, [])

  /** Steers the snake; the first steer of an idle game also starts it. */
  const steer = useCallback((direction: SnakeDirection) => {
    setGame((prev) => changeSnakeDirection(startSnakeGame(prev), direction))
  }, [])

  // Game loop — recreated when the status flips or the speed changes.
  const tickMs = getSnakeTickMs(game.score)
  useEffect(() => {
    if (game.status !== 'running') {
      return undefined
    }
    let rafId = 0
    let lastTick = performance.now()
    const frame = (now: number): void => {
      if (now - lastTick >= tickMs) {
        lastTick = now
        setGame((prev) => stepSnakeGame(prev))
      }
      rafId = window.requestAnimationFrame(frame)
    }
    rafId = window.requestAnimationFrame(frame)
    return () => window.cancelAnimationFrame(rafId)
  }, [game.status, tickMs])

  // Persist the high score when a run ends.
  useEffect(() => {
    if (isFinished(game)) {
      saveSnakeHighScore(game.score)
    }
  }, [game])

  // Keyboard controls: arrows/WASD steer, space starts/pauses, enter restarts.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const direction = KEY_DIRECTIONS[event.key]
      if (direction) {
        event.preventDefault()
        steer(direction)
        return
      }
      if (event.key === ' ') {
        event.preventDefault()
        setGame((prev) => {
          if (isFinished(prev)) {
            return startSnakeGame(createSnakeGame(SNAKE_COLS, SNAKE_ROWS))
          }
          return prev.status === 'idle'
            ? startSnakeGame(prev)
            : toggleSnakePause(prev)
        })
        return
      }
      if (event.key === 'Enter') {
        setGame((prev) =>
          isFinished(prev)
            ? startSnakeGame(createSnakeGame(SNAKE_COLS, SNAKE_ROWS))
            : prev
        )
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [steer])

  // Losing the tab mid-run should not kill the snake.
  useEffect(() => {
    const onVisibilityChange = (): void => {
      if (document.visibilityState === 'hidden') {
        setGame((prev) =>
          prev.status === 'running' ? toggleSnakePause(prev) : prev
        )
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  return { game, best, start, restart, togglePause, steer }
}
