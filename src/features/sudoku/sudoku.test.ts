import { describe, expect, it, beforeEach, vi } from 'vitest'
import {
  appendPuzzleHistory,
  cellHighlights,
  countSolutions,
  createGame,
  enterDigit,
  generatePuzzle,
  generateKillerPuzzle,
  hasConflict,
  hasPuzzleHistory,
  HISTORY_LIMIT,
  isSolved,
  puzzleFingerprint,
  readSavedGame,
  selectCell,
  saveGame,
  STORAGE_KEY,
  undoMove,
  type Difficulty,
} from './sudoku'

const knownPuzzle = [
  '530070000',
  '600195000',
  '098000060',
  '800060003',
  '400803001',
  '700020006',
  '060000280',
  '000419005',
  '000080079',
]
  .join('')
  .split('')
  .map(Number)

function seededRandom(seed: number): () => number {
  let value = seed >>> 0
  return () => {
    value ^= value << 13
    value ^= value >>> 17
    value ^= value << 5
    return (value >>> 0) / 0x1_0000_0000
  }
}

describe('Sudoku solver and generator', () => {
  it('counts no, one, and multiple solutions with an early second-solution exit', () => {
    expect(countSolutions(knownPuzzle)).toMatchObject({
      count: 1,
      complete: true,
    })
    expect(countSolutions(Array<number>(81).fill(0))).toMatchObject({
      count: 2,
      complete: true,
    })
    const impossible = [...knownPuzzle]
    impossible[2] = 5
    expect(countSolutions(impossible)).toMatchObject({
      count: 0,
      complete: true,
    })
  })

  it('generates 100 unique, non-repeating puzzles per difficulty with seeded randomness', () => {
    const random = seededRandom(0x59_2026)
    const history = new Set<string>()
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
    for (const difficulty of difficulties) {
      for (let index = 0; index < 100; index += 1) {
        const puzzle = generatePuzzle(difficulty, random)
        const fingerprint = puzzleFingerprint(puzzle.puzzle)
        expect(history.has(fingerprint)).toBe(false)
        history.add(fingerprint)
        expect(countSolutions(puzzle.puzzle)).toMatchObject({
          count: 1,
          complete: true,
        })
        expect(countSolutions(puzzle.solution)).toMatchObject({
          count: 1,
          complete: true,
        })
      }
    }
  }, 120_000)

  it('creates an unfinished game and detects completion only at the solution', () => {
    const puzzle = generatePuzzle('easy', seededRandom(59))
    const game = createGame(puzzle)
    expect(game.entries).toEqual(puzzle.puzzle)
    expect(isSolved(game)).toBe(false)
    expect(
      isSolved({ entries: puzzle.solution, solution: puzzle.solution })
    ).toBe(true)
  })

  it('keeps clues fixed, toggles pencil notes, and restores moves with undo', () => {
    const game = createGame(generatePuzzle('easy', seededRandom(591)))
    const given = game.puzzle.findIndex((value) => value !== 0)
    const selectedGiven = selectCell(game, given)
    expect(enterDigit(selectedGiven, 1)).toBe(selectedGiven)

    const empty = game.puzzle.findIndex((value) => value === 0)
    const noteGame = { ...game, selected: empty, pencil: true }
    const noted = enterDigit(noteGame, 5)
    expect(noted.entries[empty]).toBe(0)
    expect(noted.notes[empty]).toEqual([5])
    expect(enterDigit(noted, 5).notes[empty]).toEqual([])
    expect(undoMove(noted).notes[empty]).toEqual([])

    const answer = enterDigit(
      { ...noted, pencil: false },
      game.solution[empty]!
    )
    expect(answer.entries[empty]).toBe(game.solution[empty])
    expect(answer.notes[empty]).toEqual([])
    expect(undoMove(answer).notes[empty]).toEqual([5])
  })

  it('completes only a correct board and derives matching and conflict highlights', () => {
    const puzzle = generatePuzzle('easy', seededRandom(592))
    const target = puzzle.puzzle.findIndex((value) => value === 0)
    const entries = puzzle.solution.map((value, index) =>
      index === target ? 0 : value
    )
    const almostDone = { ...createGame(puzzle), entries, selected: target }
    const wrong = enterDigit(almostDone, (puzzle.solution[target]! % 9) + 1)
    expect(wrong.completed).toBe(false)
    const completed = enterDigit(almostDone, puzzle.solution[target]!)
    expect(completed.completed).toBe(true)

    const conflictGame = {
      ...createGame({
        puzzle: Array<number>(81).fill(0),
        solution: puzzle.solution,
        difficulty: 'easy' as const,
      }),
      entries: Array<number>(81).fill(0),
      selected: 0,
      highlightMistakes: true,
    }
    conflictGame.entries[0] = 4
    conflictGame.entries[1] = 4
    expect(hasConflict(conflictGame, 0)).toBe(true)
    expect(cellHighlights(conflictGame, 1)).toMatchObject({
      related: true,
      matching: true,
      mistake: true,
    })
    expect(cellHighlights(conflictGame, 2).matching).toBe(false)
  })

  it('avoids known boards and evicts history beyond the retained limit', () => {
    const fingerprint = puzzleFingerprint(knownPuzzle)
    expect(hasPuzzleHistory(knownPuzzle, [fingerprint])).toBe(true)
    const history = appendPuzzleHistory(
      Array.from({ length: HISTORY_LIMIT }, (_, i) => String(i)),
      knownPuzzle
    )
    expect(history).toHaveLength(HISTORY_LIMIT)
    expect(history[0]).toBe('1')
    expect(history.at(-1)).toBe(fingerprint)
  })
})

describe('Sudoku save state', () => {
  beforeEach(() => localStorage.clear())

  it('saves and restores the current game and retained puzzle history', () => {
    const puzzle = generatePuzzle('easy', seededRandom(5901))
    const game = createGame(puzzle)
    const fingerprint = puzzleFingerprint(puzzle.puzzle)
    expect(saveGame(game, [fingerprint])).toBe(true)
    expect(readSavedGame()).toEqual({ game, history: [fingerprint] })
  })

  it('ignores corrupt, unsupported, or inconsistent stored data without clearing it', () => {
    localStorage.setItem(STORAGE_KEY, '{broken')
    expect(readSavedGame()).toEqual({ game: null, history: [] })
    expect(localStorage.getItem(STORAGE_KEY)).toBe('{broken')
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, game: {} }))
    expect(readSavedGame()).toEqual({ game: null, history: [] })
  })

  it('rejects restored entries that change an original clue', () => {
    const puzzle = generatePuzzle('easy', seededRandom(5902))
    const game = createGame(puzzle)
    const given = puzzle.puzzle.findIndex((value) => value !== 0)
    game.entries[given] = game.entries[given] === 1 ? 2 : 1
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, game, history: [] })
    )
    expect(readSavedGame()).toEqual({ game: null, history: [] })
  })

  it('continues without storage when the browser rejects writes', () => {
    const game = createGame(generatePuzzle('easy', seededRandom(5903)))
    const setItem = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('storage full')
      })
    expect(saveGame(game, [])).toBe(false)
    setItem.mockRestore()
  })
})

describe('Sudoku adversarial regressions', () => {
  beforeEach(() => localStorage.clear())

  it('does not update game state when focus returns to the selected cell', () => {
    const game = createGame(generatePuzzle('easy', seededRandom(5914)))
    expect(selectCell(game, game.selected)).toBe(game)
    const atEnd = selectCell(game, 80)
    expect(selectCell(atEnd, 100)).toBe(atEnd)
  })

  it('records game start and completion times and clears the finish time after undo', () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(1000)
    try {
      const puzzle = generatePuzzle('easy', seededRandom(5912))
      const game = createGame(puzzle)
      expect(game.startedAt).toBe(1000)
      const selected = puzzle.puzzle.findIndex((value) => value === 0)
      const entries = [...puzzle.solution]
      entries[selected] = 0
      now.mockReturnValue(61000)
      const complete = enterDigit(
        { ...game, selected, entries },
        puzzle.solution[selected]!
      )
      expect(complete.completedAt).toBe(61000)
      expect(undoMove(complete).completedAt).toBeUndefined()
    } finally {
      now.mockRestore()
    }
  })

  it('rejects corrupt saved timing without accepting a negative or nonnumeric elapsed duration', () => {
    const game = createGame(generatePuzzle('easy', seededRandom(5913)))
    saveGame({ ...game, startedAt: -1 }, [])
    expect(readSavedGame().game).toBeNull()
  })

  it.each<Difficulty>(['easy', 'medium', 'hard'])(
    'generates a uniquely solvable %s Killer board with valid cage sums and distinct cage digits',
    (difficulty) => {
      const puzzle = generateKillerPuzzle(difficulty, seededRandom(5911))
      expect(countSolutions(puzzle.puzzle)).toMatchObject({
        count: 1,
        complete: true,
      })
      for (const cage of puzzle.cages!) {
        const digits = cage.cells.map((index) => puzzle.solution[index]!)
        expect(new Set(digits).size).toBe(digits.length)
        expect(digits.reduce((sum, digit) => sum + digit, 0)).toBe(cage.sum)
      }
    },
    30_000
  )

  it('assigns every Killer cell to exactly one connected cage and restores progress', () => {
    const puzzle = generateKillerPuzzle('easy', seededRandom(5904))
    const cells = puzzle
      .cages!.flatMap((cage) => cage.cells)
      .sort((a, b) => a - b)
    expect(cells).toEqual(Array.from({ length: 81 }, (_, index) => index))
    for (const cage of puzzle.cages!) {
      const visited = new Set([cage.cells[0]!])
      for (const cell of visited) {
        for (const neighbor of cage.cells) {
          if (
            Math.abs(Math.floor(cell / 9) - Math.floor(neighbor / 9)) +
              Math.abs((cell % 9) - (neighbor % 9)) ===
            1
          )
            visited.add(neighbor)
        }
      }
      expect(visited.size).toBe(cage.cells.length)
    }
    const game = createGame(puzzle)
    expect(saveGame(game, [])).toBe(true)
    expect(readSavedGame().game).toEqual(game)
  })

  it('does not add hidden notes to a filled cell or make its save unreadable', () => {
    const puzzle = generatePuzzle('easy', seededRandom(5905))
    const selected = puzzle.puzzle.findIndex((value) => value === 0)
    const filled = enterDigit(
      { ...createGame(puzzle), selected },
      puzzle.solution[selected]!
    )
    const pencil = { ...filled, pencil: true }
    const next = enterDigit(pencil, 3)
    expect(next).toBe(pencil)
    saveGame(next, [])
    expect(readSavedGame().game).toEqual(next)
  })

  it('does not charge another mistake or undo slot for repeating the current value', () => {
    const puzzle = generatePuzzle('easy', seededRandom(5906))
    const selected = puzzle.puzzle.findIndex((value) => value === 0)
    const wrongDigit = (puzzle.solution[selected]! % 9) + 1
    const wrong = enterDigit({ ...createGame(puzzle), selected }, wrongDigit)
    expect(wrong.mistakes).toBe(1)
    expect(enterDigit(wrong, wrongDigit)).toBe(wrong)
  })

  it('preserves a valid saved Killer cage layout instead of silently replacing it', () => {
    const puzzle = generatePuzzle('easy', seededRandom(5907))
    const game = createGame({
      ...puzzle,
      mode: 'killer',
      cages: puzzle.solution.map((sum, index) => ({ cells: [index], sum })),
    })
    saveGame(game, [])
    expect(readSavedGame().game).toEqual(game)
  })

  it('recovers progress saved with the earlier overlapping Killer cage map', () => {
    const puzzle = generateKillerPuzzle('easy', seededRandom(5908))
    const selected = puzzle.puzzle.findIndex((value) => value === 0)
    const game = enterDigit(
      { ...createGame(puzzle), selected },
      puzzle.solution[selected]!
    )
    const legacy = {
      ...game,
      cages: game.cages.map((cage) =>
        cage.cells[0] === 36
          ? { cells: [36, 42], sum: game.solution[36]! + game.solution[42]! }
          : cage
      ),
    }
    saveGame(legacy, [])
    expect(readSavedGame().game).toEqual(game)
  })

  it('locks input and undo at three distinct mistakes and retains the lock on reload', () => {
    const puzzle = generatePuzzle('easy', seededRandom(5909))
    const selected = puzzle.puzzle.findIndex((value) => value === 0)
    let game = { ...createGame(puzzle), selected }
    for (let offset = 1; offset <= 3; offset += 1) {
      game = enterDigit(
        game,
        ((puzzle.solution[selected]! - 1 + offset) % 9) + 1
      )
    }
    expect(game.mistakes).toBe(3)
    expect(enterDigit(game, 0)).toBe(game)
    expect(undoMove(game)).toBe(game)
    saveGame(game, [])
    expect(readSavedGame().game).toEqual(game)
  })

  it('keeps erasing notes and undoing moves saveable', () => {
    const puzzle = generatePuzzle('easy', seededRandom(5910))
    const selected = puzzle.puzzle.findIndex((value) => value === 0)
    const noted = enterDigit(
      { ...createGame(puzzle), selected, pencil: true },
      4
    )
    const erased = enterDigit(noted, 0)
    expect(erased.notes[selected]).toEqual([])
    const restored = undoMove(erased)
    expect(restored.notes[selected]).toEqual([4])
    saveGame(restored, [])
    expect(readSavedGame().game).toEqual(restored)
  })
})
