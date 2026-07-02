import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { loadSnakeHighScore, saveSnakeHighScore } from './highScore'

const STORAGE_KEY = 'snake:high-score'

describe('snake high score persistence', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('loadSnakeHighScore', () => {
    it('returns 0 when nothing is stored', () => {
      expect(loadSnakeHighScore()).toBe(0)
    })

    it('returns the stored score', () => {
      window.localStorage.setItem(STORAGE_KEY, '12')
      expect(loadSnakeHighScore()).toBe(12)
    })

    it('returns 0 for a malformed value', () => {
      window.localStorage.setItem(STORAGE_KEY, 'not-a-number')
      expect(loadSnakeHighScore()).toBe(0)
    })

    it('returns 0 for a negative value', () => {
      window.localStorage.setItem(STORAGE_KEY, '-5')
      expect(loadSnakeHighScore()).toBe(0)
    })

    it('returns 0 when storage access throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage disabled')
      })
      expect(loadSnakeHighScore()).toBe(0)
    })
  })

  describe('saveSnakeHighScore', () => {
    it('persists a new high score and returns it', () => {
      expect(saveSnakeHighScore(7)).toBe(7)
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe('7')
    })

    it('keeps the existing high score when the new score is lower', () => {
      window.localStorage.setItem(STORAGE_KEY, '10')
      expect(saveSnakeHighScore(3)).toBe(10)
      expect(window.localStorage.getItem(STORAGE_KEY)).toBe('10')
    })

    it('floors fractional scores', () => {
      expect(saveSnakeHighScore(4.9)).toBe(4)
    })

    it('still returns the best score when storage writes throw', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded')
      })
      expect(saveSnakeHighScore(9)).toBe(9)
    })
  })
})
