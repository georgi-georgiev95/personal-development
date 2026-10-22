import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Modal } from '@/shared/ui-kit'
import { cageOutline } from '@/features/sudoku/cages'
import { SudokuScores, SudokuStats } from '@/features/sudoku/pages/SudokuScores'
import SudokuWorker from '@/features/sudoku/sudoku.worker?worker&inline'
import {
  createGame,
  appendPuzzleHistory,
  cellHighlights,
  enterDigit as applyDigit,
  hasPuzzleHistory,
  selectCell,
  readSavedGame,
  saveGame,
  undoMove,
  MAX_MISTAKES,
  type Difficulty,
  type SudokuMode,
  type Game,
  type Puzzle,
} from '@/features/sudoku/sudoku'
import {
  Board,
  BoardColumn,
  BoardRow,
  CageOverlay,
  CageLabel,
  Cell,
  Completion,
  ControlButton,
  ControlToolbar,
  Controls,
  DifficultyBar,
  DifficultyButton,
  Eyebrow,
  Header,
  Layout,
  MistakeCounter,
  ModeBar,
  ModeButton,
  Notes,
  NumberPad,
  NewPuzzle,
  Page,
  Status,
} from '@/features/sudoku/pages/SudokuPage.styles'

function hasProgress(game: Game): boolean {
  return (
    !game.completed &&
    (game.entries.some((value, index) => value !== game.puzzle[index]) ||
      game.notes.some((cell) => cell.length > 0))
  )
}

export function SudokuPage() {
  const [initial] = useState(readSavedGame)
  const [game, setGame] = useState<Game | null>(() => initial.game)
  const [history, setHistory] = useState<string[]>(() => initial.history)
  const [status, setStatus] = useState('')
  const [generating, setGenerating] = useState(false)
  const [storageWarning, setStorageWarning] = useState(false)
  const worker = useRef<Worker | null>(null)
  const requestId = useRef(0)

  const requestPuzzle = useCallback(
    (
      difficulty: Difficulty,
      confirmLoss: boolean,
      mode: SudokuMode = game?.mode ?? 'classic'
    ) => {
      if (
        confirmLoss &&
        game &&
        hasProgress(game) &&
        !window.confirm('Discard your unfinished puzzle and start a new one?')
      )
        return
      worker.current?.terminate()
      setGenerating(true)
      setStatus(`Preparing a ${mode} ${difficulty} puzzle…`)
      const id = ++requestId.current
      let nextWorker: Worker
      try {
        nextWorker = new SudokuWorker()
      } catch {
        setGenerating(false)
        setStatus('Puzzle generation could not start. Please retry.')
        return
      }
      worker.current = nextWorker
      nextWorker.onmessage = (
        event: MessageEvent<{ id: number; puzzle?: Puzzle; error?: string }>
      ) => {
        if (event.data.id !== requestId.current) return
        nextWorker.terminate()
        worker.current = null
        const nextPuzzle = event.data.puzzle
        if (!nextPuzzle) {
          setGenerating(false)
          setStatus(
            event.data.error ?? 'Puzzle generation failed. Please retry.'
          )
          return
        }
        if (hasPuzzleHistory(nextPuzzle.puzzle, history)) {
          setGenerating(false)
          setStatus(
            'That puzzle is already in your recent history. Please retry.'
          )
          return
        }
        setHistory((current) => appendPuzzleHistory(current, nextPuzzle.puzzle))
        setGame(createGame(nextPuzzle))
        setGenerating(false)
        setStatus('')
      }
      nextWorker.onerror = () => {
        nextWorker.terminate()
        if (requestId.current === id) {
          setGenerating(false)
          setStatus('Puzzle generation failed. Please retry.')
          worker.current = null
        }
      }
      nextWorker.postMessage({ id, difficulty, history, mode })
    },
    [game, history]
  )

  useEffect(() => {
    if (!game) {
      const timer = window.setTimeout(() => requestPuzzle('easy', false), 0)
      return () => window.clearTimeout(timer)
    }
    return () => worker.current?.terminate()
  }, [game, requestPuzzle])

  useEffect(() => {
    if (game && !saveGame(game, history))
      window.setTimeout(() => setStorageWarning(true), 0)
  }, [game, history])

  const updateGame = (transform: (current: Game) => Game) => {
    setGame((current) => (current ? transform(current) : current))
  }

  const enterDigit = (digit: number) => {
    updateGame((current) => applyDigit(current, digit))
  }

  const moveSelection = (index: number) =>
    updateGame((current) => selectCell(current, index))

  const restart = () => {
    if (
      !game ||
      (!hasProgress(game) && !game.completed) ||
      !window.confirm(
        'Restart this puzzle? Your answers and notes will be cleared.'
      )
    )
      return
    setGame((current) =>
      current
        ? {
            ...current,
            entries: [...current.puzzle],
            notes: Array.from({ length: 81 }, () => []),
            undo: [],
            mistakes: 0,
            completed: false,
            startedAt: Date.now(),
            completedAt: undefined,
            scoreSubmitted: false,
          }
        : current
    )
  }

  const changeDifficulty = (difficulty: Difficulty) => {
    if (game?.difficulty === difficulty) return
    requestPuzzle(difficulty, true)
  }

  const changeMode = (mode: SudokuMode) => {
    if (game?.mode === mode) return
    requestPuzzle(game?.difficulty ?? 'easy', true, mode)
  }

  const locked = Boolean(game && game.mistakes >= MAX_MISTAKES)
  const cageAt = Array<number>(81).fill(-1)
  const cageLabels = new Map<number, number>()
  if (game?.mode === 'killer') {
    game.cages.forEach((cage, cageIndex) => {
      cage.cells.forEach((index) => {
        cageAt[index] = cageIndex
      })
      const labelCell = [...cage.cells].sort((a, b) =>
        Math.floor(a / 9) === Math.floor(b / 9)
          ? (a % 9) - (b % 9)
          : Math.floor(a / 9) - Math.floor(b / 9)
      )[0]
      if (labelCell !== undefined) cageLabels.set(labelCell, cage.sum)
    })
  }
  const cageOutlines =
    game?.mode === 'killer'
      ? game.cages.map((cage, key) => ({ key, path: cageOutline(cage.cells) }))
      : []
  const digitComplete = (digit: number) =>
    game !== null &&
    game.solution.every(
      (solutionValue, cellIndex) =>
        solutionValue !== digit || game.entries[cellIndex] === digit
    )

  return (
    <Page>
      <Header>
        <div>
          <Eyebrow>Take a break</Eyebrow>
          <h1>Sudoku</h1>
          <p>
            A quiet puzzle, saved on this browser. No account or network needed
            while you play.
          </p>
        </div>
      </Header>
      <ModeBar aria-label="Game mode">
        <span>Mode:</span>
        {(['classic', 'killer'] as const).map((mode) => (
          <ModeButton
            key={mode}
            type="button"
            disabled={generating}
            aria-pressed={(game?.mode ?? 'classic') === mode}
            onClick={() => changeMode(mode)}
          >
            {mode[0]!.toUpperCase() + mode.slice(1)}
          </ModeButton>
        ))}
      </ModeBar>
      <DifficultyBar aria-label="Difficulty">
        <span>Difficulty:</span>
        {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
          <DifficultyButton
            key={difficulty}
            type="button"
            disabled={generating}
            aria-pressed={(game?.difficulty ?? 'easy') === difficulty}
            onClick={() => changeDifficulty(difficulty)}
          >
            {difficulty[0]!.toUpperCase() + difficulty.slice(1)}
          </DifficultyButton>
        ))}
        <MistakeCounter>
          <span>Mistakes</span>
          <strong>
            {game?.mistakes ?? 0}/{MAX_MISTAKES}
          </strong>
        </MistakeCounter>
      </DifficultyBar>
      <SudokuStats game={game} />
      <Layout>
        <BoardColumn>
          {game ? (
            <Board
              data-mode={game.mode}
              role="grid"
              aria-label={`${game.mode === 'killer' ? 'Killer' : 'Classic'} Sudoku board`}
              aria-disabled={generating || locked}
              onKeyDown={(event) => {
                if (generating || locked) return
                const deltas: Record<string, number> = {
                  ArrowUp: -9,
                  ArrowDown: 9,
                  ArrowLeft: -1,
                  ArrowRight: 1,
                }
                if (event.key in deltas) {
                  event.preventDefault()
                  const column = game.selected % 9
                  const next =
                    event.key === 'ArrowLeft' && column === 0
                      ? game.selected
                      : event.key === 'ArrowRight' && column === 8
                        ? game.selected
                        : Math.max(
                            0,
                            Math.min(80, game.selected + deltas[event.key]!)
                          )
                  moveSelection(next)
                  requestAnimationFrame(() =>
                    document.getElementById(`sudoku-cell-${next}`)?.focus()
                  )
                } else if (/^[1-9]$/.test(event.key)) {
                  event.preventDefault()
                  enterDigit(Number(event.key))
                } else if (
                  event.key === 'Backspace' ||
                  event.key === 'Delete'
                ) {
                  event.preventDefault()
                  enterDigit(0)
                }
              }}
            >
              {Array.from({ length: 9 }, (_, row) => (
                <BoardRow role="row" key={row} $killer={game.mode === 'killer'}>
                  {game.entries
                    .slice(row * 9, row * 9 + 9)
                    .map((value, column) => {
                      const index = row * 9 + column
                      const highlights = cellHighlights(game, index)
                      const cage = game.cages.find(({ cells }) =>
                        cells.includes(index)
                      )
                      return (
                        <Cell
                          key={index}
                          id={`sudoku-cell-${index}`}
                          role="gridcell"
                          disabled={generating || locked}
                          aria-selected={game.selected === index}
                          aria-label={`Row ${row + 1}, column ${column + 1}, ${value ? `value ${value}` : 'empty'}, ${highlights.given ? 'given' : 'editable'}${game.notes[index]!.length ? `, notes ${game.notes[index]!.join(', ')}` : ''}${highlights.mistake ? ', conflict' : ''}${cage ? `, cage ${game.cages.indexOf(cage) + 1}, sum ${cage.sum}, cells ${cage.cells.map((cell) => `row ${Math.floor(cell / 9) + 1} column ${(cell % 9) + 1}`).join('; ')}` : ''}`}
                          tabIndex={game.selected === index ? 0 : -1}
                          $selected={highlights.selected}
                          $related={highlights.related}
                          $match={highlights.matching}
                          $given={highlights.given}
                          $mistake={highlights.mistake}
                          $killer={game.mode === 'killer'}
                          onFocus={() => moveSelection(index)}
                          onClick={() => moveSelection(index)}
                        >
                          {cageLabels.has(index) && (
                            <CageLabel aria-hidden="true">
                              {cageLabels.get(index)}
                            </CageLabel>
                          )}
                          {value ||
                            (game.notes[index]!.length > 0 ? (
                              <Notes
                                $selected={highlights.selected}
                                $killer={game.mode === 'killer'}
                                aria-hidden="true"
                              >
                                {Array.from({ length: 9 }, (_, note) => (
                                  <span key={note}>
                                    {game.notes[index]!.includes(note + 1)
                                      ? note + 1
                                      : ''}
                                  </span>
                                ))}
                              </Notes>
                            ) : (
                              ''
                            ))}
                        </Cell>
                      )
                    })}
                </BoardRow>
              ))}
              {game.mode === 'killer' && (
                <CageOverlay
                  viewBox="0 0 900 900"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  {cageOutlines.map(({ key, path }) => (
                    <path key={`halo-${key}`} className="cage-halo" d={path} />
                  ))}
                  {cageOutlines.map(({ key, path }) => (
                    <path key={key} d={path} />
                  ))}
                </CageOverlay>
              )}
            </Board>
          ) : null}
          {game?.completed && (
            <Completion role="status">Puzzle complete. Nicely done.</Completion>
          )}
          <Status aria-live="polite">
            {status ||
              (storageWarning
                ? 'Progress is only in memory because browser storage is unavailable.'
                : '')}
          </Status>
        </BoardColumn>
        <Controls>
          <ControlToolbar aria-label="Puzzle tools">
            <ControlButton
              type="button"
              onClick={() => updateGame(undoMove)}
              disabled={generating || locked || !game?.undo.length}
              aria-label="Undo"
              title="Undo"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 14 4 9l5-5M4 9h9a7 7 0 1 1-6.2 10.2" />
              </svg>
            </ControlButton>
            <ControlButton
              type="button"
              disabled={
                generating ||
                locked ||
                !game ||
                game.completed ||
                game.puzzle[game.selected] !== 0 ||
                (game.entries[game.selected] === 0 &&
                  !game.notes[game.selected]!.length)
              }
              onClick={() => enterDigit(0)}
              aria-label="Erase selected cell"
              title="Erase selected cell"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m4 15 9-10a2 2 0 0 1 3 0l4 4a2 2 0 0 1 0 3l-8 8H7l-3-3a1.5 1.5 0 0 1 0-2ZM8 20l-4-5m10-7 5 5M13 20h8" />
              </svg>
            </ControlButton>
            <ControlButton
              type="button"
              disabled={generating || locked || !game || game.completed}
              aria-pressed={game?.pencil ?? false}
              onClick={() =>
                updateGame((current) => ({
                  ...current,
                  pencil: !current.pencil,
                }))
              }
              aria-label={`Notes ${game?.pencil ? 'on' : 'off'}`}
              title={`Notes ${game?.pencil ? 'on' : 'off'}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m4 16 11-11a2 2 0 0 1 3 0l1 1a2 2 0 0 1 0 3L8 20l-5 1 1-5Zm9-9 4 4M4 16l4 4M3 21h18" />
              </svg>
            </ControlButton>
            <ControlButton
              type="button"
              onClick={restart}
              disabled={
                generating || !game || (!hasProgress(game) && !game.completed)
              }
              aria-label="Restart puzzle"
              title="Restart puzzle"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 8a8 8 0 1 1-1 5" />
                <path d="M4 3v5h5" />
              </svg>
            </ControlButton>
          </ControlToolbar>
          <NumberPad aria-label="Number pad">
            {Array.from({ length: 9 }, (_, index) => (
              <button
                type="button"
                key={index}
                disabled={
                  generating || locked || !game || digitComplete(index + 1)
                }
                aria-label={`Enter ${index + 1}${digitComplete(index + 1) ? ', all placed' : ''}`}
                onClick={() => enterDigit(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </NumberPad>
          <NewPuzzle>
            <Button
              onClick={() => requestPuzzle(game?.difficulty ?? 'easy', true)}
            >
              New puzzle
            </Button>
          </NewPuzzle>
          <Status>
            Select a cell, then enter a number. Use arrow keys to move and 1–9
            to play from the keyboard.
          </Status>
        </Controls>
      </Layout>
      <SudokuScores
        key={game ? `${game.mode}-${game.puzzle.join('')}` : 'loading'}
        game={game}
        onSaved={(savedGame) =>
          updateGame((current) =>
            current.startedAt === savedGame.startedAt &&
            current.mode === savedGame.mode &&
            current.puzzle.join('') === savedGame.puzzle.join('')
              ? { ...current, scoreSubmitted: true }
              : current
          )
        }
      />
      <Modal open={locked} label="Game over" showCloseButton={false}>
        <Modal.Header>
          <h2>Game Over</h2>
        </Modal.Header>
        <Modal.Content>
          <p>
            You have made {game?.mistakes ?? MAX_MISTAKES} mistakes and lost
            this game.
          </p>
        </Modal.Content>
        <Modal.Footer>
          <Button
            onClick={() => game && setGame(createGame(game))}
            disabled={generating || !game}
          >
            Retry puzzle
          </Button>
          <Button
            onClick={() => game && requestPuzzle(game.difficulty, false)}
            disabled={generating || !game}
          >
            New Game
          </Button>
        </Modal.Footer>
      </Modal>
    </Page>
  )
}

export default SudokuPage
