import {
  generateKillerPuzzle,
  generatePuzzle,
  hasPuzzleHistory,
  type Difficulty,
  type SudokuMode,
} from '@/features/sudoku/sudoku'

self.onmessage = (
  event: MessageEvent<{
    id: number
    difficulty: Difficulty
    history: string[]
    mode?: SudokuMode
  }>
) => {
  const { id, difficulty, history, mode = 'classic' } = event.data
  try {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const puzzle =
        mode === 'killer'
          ? generateKillerPuzzle(difficulty)
          : generatePuzzle(difficulty)
      if (!hasPuzzleHistory(puzzle.puzzle, history)) {
        self.postMessage({ id, puzzle })
        return
      }
    }
    self.postMessage({
      id,
      error: 'Could not find a new puzzle. Please retry.',
    })
  } catch (error) {
    self.postMessage({
      id,
      error:
        error instanceof Error ? error.message : 'Puzzle generation failed.',
    })
  }
}
