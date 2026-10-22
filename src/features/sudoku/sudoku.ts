export type Difficulty = 'easy' | 'medium' | 'hard'
export type SudokuMode = 'classic' | 'killer'

export interface Cage {
  cells: number[]
  sum: number
}

export interface Puzzle {
  puzzle: number[]
  solution: number[]
  difficulty: Difficulty
  mode?: SudokuMode
  cages?: Cage[]
}

export interface UndoState {
  entries: number[]
  notes: number[][]
}

export interface Game extends Puzzle {
  entries: number[]
  notes: number[][]
  undo: UndoState[]
  selected: number
  pencil: boolean
  mistakes: number
  mode: SudokuMode
  cages: Cage[]
  completed: boolean
  startedAt?: number
  completedAt?: number
  scoreSubmitted?: boolean
}

export const STORAGE_KEY = 'daywise.sudoku.v1'
export const HISTORY_LIMIT = 1000
export const MAX_MISTAKES = 3
export const SUDOKU_MODES: SudokuMode[] = ['classic', 'killer']
const SEARCH_BUDGET = 20_000

function isConsistent(board: number[]): boolean {
  for (let index = 0; index < 81; index += 1) {
    const value = board[index]!
    if (value === 0) continue
    const row = Math.floor(index / 9)
    const column = index % 9
    for (let offset = 0; offset < 9; offset += 1) {
      if (offset !== column && board[row * 9 + offset] === value) return false
      if (offset !== row && board[offset * 9 + column] === value) return false
      const boxIndex =
        (Math.floor(row / 3) * 3 + Math.floor(offset / 3)) * 9 +
        Math.floor(column / 3) * 3 +
        (offset % 3)
      if (boxIndex !== index && board[boxIndex] === value) return false
    }
  }
  return true
}

function candidates(board: number[], index: number): number[] {
  const row = Math.floor(index / 9)
  const column = index % 9
  const used = new Set<number>()
  for (let i = 0; i < 9; i += 1) {
    used.add(board[row * 9 + i] ?? 0)
    used.add(board[i * 9 + column] ?? 0)
  }
  const rowStart = Math.floor(row / 3) * 3
  const columnStart = Math.floor(column / 3) * 3
  for (let r = rowStart; r < rowStart + 3; r += 1) {
    for (let c = columnStart; c < columnStart + 3; c += 1) {
      used.add(board[r * 9 + c] ?? 0)
    }
  }
  return Array.from({ length: 9 }, (_, i) => i + 1).filter((n) => !used.has(n))
}

interface SearchBudget {
  nodes: number
  exhausted: boolean
}

function search(board: number[], limit: number, budget: SearchBudget): number {
  let bestIndex = -1
  let bestValues: number[] = []
  for (let i = 0; i < 81; i += 1) {
    if (board[i] !== 0) continue
    const values = candidates(board, i)
    if (values.length === 0) return 0
    if (bestIndex < 0 || values.length < bestValues.length) {
      bestIndex = i
      bestValues = values
      if (values.length === 1) break
    }
  }
  if (bestIndex < 0) return 1
  let solutions = 0
  for (const value of bestValues) {
    budget.nodes += 1
    if (budget.nodes > SEARCH_BUDGET) {
      budget.exhausted = true
      return solutions
    }
    board[bestIndex] = value
    solutions += search(board, limit - solutions, budget)
    board[bestIndex] = 0
    if (solutions >= limit || budget.exhausted) break
  }
  return solutions
}

export function countSolutions(board: number[]): {
  count: number
  nodes: number
  complete: boolean
} {
  if (
    board.length !== 81 ||
    board.some((value) => !Number.isInteger(value) || value < 0 || value > 9)
  ) {
    return { count: 0, nodes: 0, complete: true }
  }
  if (!isConsistent(board)) return { count: 0, nodes: 0, complete: true }
  const budget: SearchBudget = { nodes: 0, exhausted: false }
  const count = search([...board], 2, budget)
  return { count, nodes: budget.nodes, complete: !budget.exhausted }
}

function randomize<T>(items: T[], random: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

function solvedGrid(random: () => number): number[] {
  const bands = randomize([0, 1, 2], random)
  const stacks = randomize([0, 1, 2], random)
  const rows = bands.flatMap((band) =>
    randomize([0, 1, 2], random).map((row) => band * 3 + row)
  )
  const columns = stacks.flatMap((stack) =>
    randomize([0, 1, 2], random).map((column) => stack * 3 + column)
  )
  const digits = randomize([1, 2, 3, 4, 5, 6, 7, 8, 9], random)
  return rows.flatMap((row) =>
    columns.map((column) => {
      const pattern = (row * 3 + Math.floor(row / 3) + column) % 9
      return digits[pattern]!
    })
  )
}

const clueFloor: Record<Difficulty, number> = { easy: 38, medium: 32, hard: 27 }

// Classify by the stable MRV solver's search-node count, independently of clue count.
function matchesDifficulty(nodes: number, difficulty: Difficulty): boolean {
  if (difficulty === 'easy') return nodes <= 100
  if (difficulty === 'medium') return nodes > 100 && nodes <= 600
  return nodes > 600
}

export function puzzleFingerprint(board: number[]): string {
  return board.join('')
}

export function hasPuzzleHistory(board: number[], history: string[]): boolean {
  return history.includes(puzzleFingerprint(board))
}

export function appendPuzzleHistory(
  history: string[],
  board: number[]
): string[] {
  return [...history, puzzleFingerprint(board)].slice(-HISTORY_LIMIT)
}

export function generatePuzzle(
  difficulty: Difficulty,
  random: () => number = Math.random
): Puzzle {
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const solution = solvedGrid(random)
    const puzzle = [...solution]
    let clues = 81
    for (const index of randomize(
      Array.from({ length: 81 }, (_, i) => i),
      random
    )) {
      if (clues <= clueFloor[difficulty]) break
      const original = puzzle[index]!
      puzzle[index] = 0
      const result = countSolutions(puzzle)
      if (!result.complete || result.count !== 1) {
        puzzle[index] = original
      } else {
        clues -= 1
      }
    }
    const effort = countSolutions(puzzle)
    if (
      effort.complete &&
      effort.count === 1 &&
      matchesDifficulty(effort.nodes, difficulty)
    ) {
      return { puzzle, solution, difficulty }
    }
  }
  throw new Error(`Could not generate a ${difficulty} puzzle. Please retry.`)
}

const KILLER_CAGE_CELLS = [
  [0],
  [1, 2],
  [3],
  [4],
  [5],
  [6],
  [7, 16, 25],
  [8, 17],
  [9, 10],
  [11, 20, 29, 38],
  [12, 13, 21, 22],
  [14, 23],
  [15, 24],
  [18, 27],
  [19, 28, 37],
  [26, 35],
  [30, 39],
  [31, 40],
  [32, 41],
  [33, 34],
  [36, 45],
  [42, 43, 52],
  [44, 53],
  [46, 47, 55],
  [48, 57, 58],
  [49, 50],
  [51, 60, 61],
  [54, 63, 64],
  [56, 65, 74],
  [59, 68],
  [62, 71, 80],
  [66, 75],
  [67, 76],
  [69, 78, 79],
  [70],
  [72, 73],
  [77],
] as const

function createCages(solution: number[]): Cage[] | undefined {
  const cages = KILLER_CAGE_CELLS.map((cells) => ({
    cells: [...cells],
    sum: cells.reduce<number>((sum, index) => sum + solution[index]!, 0),
  }))
  return cages.every(
    ({ cells }) =>
      new Set(cells.map((index) => solution[index])).size === cells.length
  )
    ? cages
    : undefined
}

export function generateKillerPuzzle(
  difficulty: Difficulty,
  random: () => number = Math.random
): Puzzle {
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const puzzle = generatePuzzle(difficulty, random)
    const cages = createCages(puzzle.solution)
    if (cages) return { ...puzzle, mode: 'killer', cages }
  }
  throw new Error('Could not generate a Killer puzzle. Please retry.')
}

export function isSolved(game: Pick<Game, 'entries' | 'solution'>): boolean {
  return game.entries.every((value, index) => value === game.solution[index])
}

export interface CellHighlights {
  selected: boolean
  related: boolean
  matching: boolean
  mistake: boolean
  given: boolean
}

export function enterDigit(game: Game, digit: number): Game {
  const index = game.selected
  if (
    game.puzzle[index] !== 0 ||
    game.completed ||
    game.mistakes >= MAX_MISTAKES ||
    !Number.isInteger(digit) ||
    digit < 0 ||
    digit > 9
  )
    return game
  if (game.pencil && digit !== 0 && game.entries[index] !== 0) return game
  if (
    !game.pencil &&
    game.entries[index] === digit &&
    !game.notes[index]!.length
  )
    return game
  const undo = [
    ...game.undo,
    { entries: [...game.entries], notes: game.notes.map((cell) => [...cell]) },
  ].slice(-50)
  if (game.pencil && digit !== 0) {
    const notes = game.notes.map((cell) => [...cell])
    notes[index] = notes[index]!.includes(digit)
      ? notes[index]!.filter((value) => value !== digit)
      : [...notes[index]!, digit].sort()
    return { ...game, notes, undo }
  }
  const entries = [...game.entries]
  const notes = game.notes.map((cell) => [...cell])
  entries[index] = digit
  notes[index] = []
  const next = {
    ...game,
    entries,
    notes,
    undo,
    mistakes:
      game.mistakes +
      Number(!game.pencil && digit !== 0 && digit !== game.solution[index]),
    completed: false,
  }
  const completed = isSolved(next)
  return { ...next, completed, completedAt: completed ? Date.now() : undefined }
}

export function undoMove(game: Game): Game {
  if (game.mistakes >= MAX_MISTAKES) return game
  const previous = game.undo.at(-1)
  if (!previous) return game
  const next = {
    ...game,
    entries: previous.entries,
    notes: previous.notes,
    undo: game.undo.slice(0, -1),
    completed: false,
    completedAt: undefined,
  }
  return { ...next, completed: isSolved(next) }
}

export function selectCell(game: Game, index: number): Game {
  const selected = Math.max(0, Math.min(80, index))
  return selected === game.selected ? game : { ...game, selected }
}

export function hasConflict(game: Game, index: number): boolean {
  const value = game.entries[index]
  if (!value || game.puzzle[index] !== 0) return false
  if (value !== game.solution[index]) return true
  const row = Math.floor(index / 9)
  const column = index % 9
  return game.entries.some((other, otherIndex) => {
    if (otherIndex === index || other !== value) return false
    return (
      Math.floor(otherIndex / 9) === row ||
      otherIndex % 9 === column ||
      (Math.floor(Math.floor(otherIndex / 9) / 3) === Math.floor(row / 3) &&
        Math.floor((otherIndex % 9) / 3) === Math.floor(column / 3))
    )
  })
}

export function cellHighlights(game: Game, index: number): CellHighlights {
  const row = Math.floor(index / 9)
  const column = index % 9
  const selectedRow = Math.floor(game.selected / 9)
  const selectedColumn = game.selected % 9
  const value = game.entries[index]
  const selectedValue = game.entries[game.selected]
  return {
    selected: game.selected === index,
    related:
      row === selectedRow ||
      column === selectedColumn ||
      (Math.floor(row / 3) === Math.floor(selectedRow / 3) &&
        Math.floor(column / 3) === Math.floor(selectedColumn / 3)),
    matching: Boolean(value && selectedValue && value === selectedValue),
    mistake: hasConflict(game, index),
    given: game.puzzle[index] !== 0,
  }
}

function validBoard(board: unknown): board is number[] {
  return (
    Array.isArray(board) &&
    board.length === 81 &&
    board.every((value) => Number.isInteger(value) && value >= 0 && value <= 9)
  )
}

function validNotes(notes: unknown): notes is number[][] {
  return (
    Array.isArray(notes) &&
    notes.length === 81 &&
    notes.every(
      (cell) =>
        Array.isArray(cell) &&
        cell.every(
          (value) => Number.isInteger(value) && value >= 1 && value <= 9
        ) &&
        new Set(cell).size === cell.length
    )
  )
}

function validCages(cages: unknown, solution: number[]): cages is Cage[] {
  if (!Array.isArray(cages)) return false
  const assigned = new Set<number>()
  for (const value of cages) {
    if (typeof value !== 'object' || value === null) return false
    const cage = value as Record<string, unknown>
    if (
      !Array.isArray(cage.cells) ||
      cage.cells.length === 0 ||
      !Number.isInteger(cage.sum)
    )
      return false
    const digits = new Set<number>()
    let sum = 0
    for (const index of cage.cells) {
      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= 81 ||
        assigned.has(index) ||
        digits.has(solution[index]!)
      )
        return false
      assigned.add(index)
      digits.add(solution[index]!)
      sum += solution[index]!
    }
    if (sum !== cage.sum) return false
  }
  return assigned.size === 81
}

function validUndo(undo: unknown): undo is UndoState[] {
  return (
    Array.isArray(undo) &&
    undo.length <= 50 &&
    undo.every((item) => {
      if (typeof item !== 'object' || item === null) return false
      const snapshot = item as Record<string, unknown>
      return validBoard(snapshot.entries) && validNotes(snapshot.notes)
    })
  )
}

export function createGame(puzzle: Puzzle): Game {
  return {
    ...puzzle,
    entries: [...puzzle.puzzle],
    notes: Array.from({ length: 81 }, () => []),
    undo: [],
    selected: 40,
    pencil: false,
    mistakes: 0,
    mode: puzzle.mode ?? 'classic',
    cages: puzzle.cages ?? [],
    completed: false,
    startedAt: Date.now(),
    completedAt: undefined,
    scoreSubmitted: false,
  }
}

export function readSavedGame(): { game: Game | null; history: string[] } {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? 'null'
    )
    if (typeof parsed !== 'object' || parsed === null)
      return { game: null, history: [] }
    const record = parsed as Record<string, unknown>
    const raw = record.game
    if (record.version !== 1 || typeof raw !== 'object' || raw === null)
      return { game: null, history: [] }
    const candidate = raw as Record<string, unknown>
    const { puzzle, solution, entries, notes, undo } = candidate
    const solutionCount = validBoard(solution) ? countSolutions(solution) : null
    let cages = candidate.cages
    // Recover the exact cage-map typo shipped before cell 45 was included.
    if (
      candidate.mode === 'killer' &&
      validBoard(solution) &&
      Array.isArray(cages) &&
      cages.length === KILLER_CAGE_CELLS.length &&
      cages.every(
        (cage, index) =>
          typeof cage === 'object' &&
          cage !== null &&
          JSON.stringify(cage.cells) ===
            JSON.stringify(index === 20 ? [36, 42] : KILLER_CAGE_CELLS[index])
      )
    )
      cages = createCages(solution)
    if (
      !validBoard(puzzle) ||
      !validBoard(solution) ||
      !validBoard(entries) ||
      !validNotes(notes) ||
      !validUndo(undo) ||
      !['easy', 'medium', 'hard'].includes(String(candidate.difficulty)) ||
      !Number.isInteger(candidate.selected) ||
      Number(candidate.selected) < 0 ||
      Number(candidate.selected) >= 81 ||
      typeof candidate.pencil !== 'boolean' ||
      (candidate.mode !== undefined &&
        !SUDOKU_MODES.includes(candidate.mode as SudokuMode)) ||
      ((candidate.mode ?? 'classic') === 'killer' &&
        !validCages(cages, solution ?? [])) ||
      (candidate.mistakes !== undefined &&
        (!Number.isInteger(candidate.mistakes) ||
          Number(candidate.mistakes) < 0 ||
          Number(candidate.mistakes) > MAX_MISTAKES)) ||
      typeof candidate.completed !== 'boolean' ||
      (candidate.scoreSubmitted !== undefined &&
        typeof candidate.scoreSubmitted !== 'boolean') ||
      (candidate.startedAt !== undefined &&
        (!Number.isSafeInteger(candidate.startedAt) ||
          Number(candidate.startedAt) < 0)) ||
      (candidate.completedAt !== undefined &&
        (!candidate.completed ||
          !Number.isSafeInteger(candidate.completedAt) ||
          candidate.startedAt === undefined ||
          Number(candidate.completedAt) < Number(candidate.startedAt))) ||
      puzzle.some(
        (value, index) =>
          value !== 0 && (value !== solution[index] || entries[index] !== value)
      ) ||
      solution.some((value) => value < 1) ||
      !solutionCount?.complete ||
      solutionCount.count !== 1 ||
      entries.some(
        (value, index) => puzzle[index] !== 0 && value !== puzzle[index]
      ) ||
      notes.some(
        (cell, index) =>
          cell.length > 0 && (entries[index] !== 0 || puzzle[index] !== 0)
      ) ||
      undo.some(
        (snapshot) =>
          snapshot.entries.some(
            (value, index) => puzzle[index] !== 0 && value !== puzzle[index]
          ) ||
          snapshot.notes.some(
            (cell, index) =>
              cell.length > 0 &&
              (snapshot.entries[index] !== 0 || puzzle[index] !== 0)
          )
      ) ||
      candidate.completed !==
        entries.every((value, index) => value === solution[index])
    ) {
      return { game: null, history: [] }
    }
    const game = {
      ...candidate,
      mistakes: candidate.mistakes ?? 0,
      mode: candidate.mode ?? 'classic',
      cages: (candidate.mode ?? 'classic') === 'killer' ? cages : [],
    } as unknown as Game
    const history = Array.isArray(record.history)
      ? record.history
          .filter(
            (item): item is string =>
              typeof item === 'string' && /^[0-9]{81}$/.test(item)
          )
          .slice(-HISTORY_LIMIT)
      : []
    const fingerprint = puzzleFingerprint(game.puzzle)
    if (!history.includes(fingerprint)) history.push(fingerprint)
    if (history.length > HISTORY_LIMIT)
      history.splice(0, history.length - HISTORY_LIMIT)
    return { game, history }
  } catch {
    return { game: null, history: [] }
  }
}

export function saveGame(game: Game, history: string[]): boolean {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        game,
        history: history.slice(-HISTORY_LIMIT),
      })
    )
    return true
  } catch {
    return false
  }
}
