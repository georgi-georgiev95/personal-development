const STORAGE_KEY = 'snake:high-score'

/** Reads the persisted high score; malformed or unavailable storage yields 0. */
export const loadSnakeHighScore = (): number => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw === null ? 0 : Number.parseInt(raw, 10)
    return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed
  } catch {
    return 0
  }
}

/**
 * Persists the score if it beats the stored high score and returns the best
 * of the two. Storage failures (e.g. private browsing) are swallowed — the
 * returned value still lets the session display the correct best.
 */
export const saveSnakeHighScore = (score: number): number => {
  const best = Math.max(loadSnakeHighScore(), Math.floor(score))
  try {
    window.localStorage.setItem(STORAGE_KEY, String(best))
  } catch {
    // Storage unavailable — keep the in-memory best for this session.
  }
  return best
}
