import { describe, it, expect } from 'vitest'
import { spawnFood } from './spawnFood'
import type { SnakePoint } from './types'

describe('spawnFood', () => {
  it('returns the first free cell when rng is 0', () => {
    const occupied: SnakePoint[] = [{ x: 0, y: 0 }]
    expect(spawnFood(3, 3, occupied, () => 0)).toEqual({ x: 1, y: 0 })
  })

  it('returns the last free cell when rng is just below 1', () => {
    const occupied: SnakePoint[] = [{ x: 2, y: 2 }]
    expect(spawnFood(3, 3, occupied, () => 0.999999)).toEqual({ x: 1, y: 2 })
  })

  it('never places food on an occupied cell', () => {
    const occupied: SnakePoint[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ]
    for (let roll = 0; roll < 6; roll += 1) {
      const food = spawnFood(3, 2, occupied, () => roll / 6)
      expect(food).not.toBeNull()
      expect(occupied).not.toContainEqual(food)
    }
  })

  it('returns null when the board is full', () => {
    const occupied: SnakePoint[] = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]
    expect(spawnFood(2, 2, occupied, () => 0.5)).toBeNull()
  })

  it('uses Math.random by default and stays within bounds', () => {
    const occupied: SnakePoint[] = [{ x: 1, y: 1 }]
    const food = spawnFood(3, 3, occupied)
    expect(food).not.toBeNull()
    expect(food).not.toEqual({ x: 1, y: 1 })
    expect(food!.x).toBeGreaterThanOrEqual(0)
    expect(food!.x).toBeLessThan(3)
    expect(food!.y).toBeGreaterThanOrEqual(0)
    expect(food!.y).toBeLessThan(3)
  })
})
