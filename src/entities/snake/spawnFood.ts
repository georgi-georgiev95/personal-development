import type { SnakePoint, SnakeRng } from './types'

/**
 * Picks a random free cell for the next food item. Returns null when no free
 * cell is left (the snake fills the whole board).
 */
export const spawnFood = (
  cols: number,
  rows: number,
  occupied: SnakePoint[],
  rng: SnakeRng = Math.random
): SnakePoint | null => {
  const taken = new Set(occupied.map((point) => point.y * cols + point.x))
  const free: SnakePoint[] = []
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!taken.has(y * cols + x)) {
        free.push({ x, y })
      }
    }
  }
  if (free.length === 0) {
    return null
  }
  const index = Math.min(Math.floor(rng() * free.length), free.length - 1)
  return free[index]
}
