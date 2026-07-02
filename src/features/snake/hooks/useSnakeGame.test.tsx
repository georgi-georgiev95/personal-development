import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, fireEvent, renderHook } from '@testing-library/react'
import { useSnakeGame, SNAKE_COLS, SNAKE_ROWS } from './useSnakeGame'

describe('useSnakeGame', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.useFakeTimers({
      toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'],
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts idle with a fresh board and the stored best score', () => {
    window.localStorage.setItem('snake:high-score', '4')
    const { result } = renderHook(() => useSnakeGame())

    expect(result.current.game.status).toBe('idle')
    expect(result.current.game.cols).toBe(SNAKE_COLS)
    expect(result.current.game.rows).toBe(SNAKE_ROWS)
    expect(result.current.best).toBe(4)
  })

  it('starts the game and queues the direction on the first steer', () => {
    const { result } = renderHook(() => useSnakeGame())

    act(() => result.current.steer('down'))

    expect(result.current.game.status).toBe('running')
    expect(result.current.game.nextDirection).toBe('down')
  })

  it('advances the snake while running', () => {
    const { result } = renderHook(() => useSnakeGame())
    act(() => result.current.start())
    const initialHead = result.current.game.snake[0]

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.game.snake[0]).not.toEqual(initialHead)
  })

  it('does not tick while paused', () => {
    const { result } = renderHook(() => useSnakeGame())
    act(() => result.current.start())
    act(() => result.current.togglePause())
    const snake = result.current.game.snake

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.game.status).toBe('paused')
    expect(result.current.game.snake).toEqual(snake)
  })

  it('ends the run at the wall and persists the best score', () => {
    const { result } = renderHook(() => useSnakeGame())

    act(() => result.current.steer('up'))
    act(() => {
      vi.advanceTimersByTime(60000)
    })

    expect(result.current.game.status).toBe('game-over')
    expect(result.current.best).toBe(result.current.game.score)
  })

  it('steers with the keyboard and ignores reversals', () => {
    const { result } = renderHook(() => useSnakeGame())

    act(() => {
      fireEvent.keyDown(window, { key: 'ArrowLeft' })
    })

    // The first key press starts the game, but a reversal is not queued.
    expect(result.current.game.status).toBe('running')
    expect(result.current.game.nextDirection).toBe('right')

    act(() => {
      fireEvent.keyDown(window, { key: 'w' })
    })
    expect(result.current.game.nextDirection).toBe('up')
  })

  it('toggles pause with space and restarts with enter after a game over', () => {
    const { result } = renderHook(() => useSnakeGame())

    act(() => {
      fireEvent.keyDown(window, { key: ' ' })
    })
    expect(result.current.game.status).toBe('running')

    act(() => {
      fireEvent.keyDown(window, { key: ' ' })
    })
    expect(result.current.game.status).toBe('paused')

    act(() => {
      fireEvent.keyDown(window, { key: ' ' })
    })
    act(() => result.current.steer('up'))
    act(() => {
      vi.advanceTimersByTime(60000)
    })
    expect(result.current.game.status).toBe('game-over')

    act(() => {
      fireEvent.keyDown(window, { key: 'Enter' })
    })
    expect(result.current.game.status).toBe('running')
    expect(result.current.game.score).toBe(0)
  })

  it('restart resets the board into a running game', () => {
    const { result } = renderHook(() => useSnakeGame())
    act(() => result.current.steer('up'))
    act(() => {
      vi.advanceTimersByTime(60000)
    })
    expect(result.current.game.status).toBe('game-over')

    act(() => result.current.restart())

    expect(result.current.game.status).toBe('running')
    expect(result.current.game.score).toBe(0)
    expect(result.current.game.snake).toHaveLength(3)
  })

  it('auto-pauses when the tab is hidden', () => {
    const { result } = renderHook(() => useSnakeGame())
    act(() => result.current.start())

    const visibility = vi
      .spyOn(document, 'visibilityState', 'get')
      .mockReturnValue('hidden')
    act(() => {
      fireEvent(document, new Event('visibilitychange'))
    })

    expect(result.current.game.status).toBe('paused')
    visibility.mockRestore()
  })
})
