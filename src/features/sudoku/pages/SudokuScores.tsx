import { useCallback, useEffect, useState } from 'react'
import { Button, Modal } from '@/shared/ui-kit'
import { useAuth } from '@/features/auth/components/useAuth'
import {
  calculateScore,
  elapsedSeconds,
  formatTime,
  type RankingPeriod,
} from '@/features/sudoku/scores'
import type { ScoreRow } from '@/features/sudoku/leaderboardService'
import type { Game, SudokuMode } from '@/features/sudoku/sudoku'
import {
  GameStats,
  Ranking,
  ScoreForm,
} from '@/features/sudoku/pages/SudokuScores.styles'

export function SudokuStats({ game }: { game: Game | null }) {
  const [now, setNow] = useState(Date.now)
  const startedAt = game?.startedAt
  const stopped = !game || game.completed || game.mistakes >= 3
  useEffect(() => {
    if (stopped) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [stopped, startedAt])
  const seconds = game ? elapsedSeconds(game, now) : 0
  return (
    <GameStats>
      <span>
        Time
        <strong role="timer" aria-live="off">
          {formatTime(seconds)}
        </strong>
      </span>
      <span>
        Score
        <strong>
          {game?.startedAt === undefined
            ? 'Practice'
            : calculateScore(
                game.difficulty,
                seconds,
                game.mistakes
              ).toLocaleString()}
        </strong>
      </span>
    </GameStats>
  )
}

function RankingRows({
  mode,
  period,
}: {
  mode: SudokuMode
  period: RankingPeriod
}) {
  const [rows, setRows] = useState<ScoreRow[] | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let active = true
    import('@/features/sudoku/leaderboardService')
      .then(({ loadLeaderboard }) => loadLeaderboard(mode, period))
      .then((results) => {
        if (active) setRows(results)
      })
      .catch(() => {
        if (active) setFailed(true)
      })
    return () => {
      active = false
    }
  }, [mode, period])
  if (failed)
    return (
      <p role="status">
        The leaderboard is unavailable. Please try refreshing it later.
      </p>
    )
  if (!rows) return <p role="status">Loading scores…</p>
  if (!rows.length) return <p>No scores yet. Finish a game to be the first.</p>
  return (
    <ol aria-label="Ranked scores">
      {rows.map((row, index) => (
        <li key={index}>
          <div>
            {index + 1}. {row.name}
            <small>
              {row.difficulty} · {formatTime(row.elapsedSeconds)} ·{' '}
              {row.mistakes} mistakes
            </small>
          </div>
          <strong>{row.score.toLocaleString()} pts</strong>
        </li>
      ))}
    </ol>
  )
}

export function SudokuScores({
  game,
  onSaved,
}: {
  game: Game | null
  onSaved: (game: Game) => void
}) {
  const { user, loading } = useAuth()
  const [name, setName] = useState('')
  const [dismissed, setDismissed] = useState(game?.scoreSubmitted ?? false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState('')
  const [period, setPeriod] = useState<RankingPeriod>('day')
  const [showRankings, setShowRankings] = useState(false)
  const [revision, setRevision] = useState(0)
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) setDismissed(true)
  }, [])
  useEffect(() => {
    if (!user) return
    let active = true
    import('@/entities/user/userService')
      .then(({ getUserProfile }) => getUserProfile(user.uid))
      .then((profile) => {
        if (active) setName(profile?.username || user.displayName || 'Player')
      })
      .catch(() => {
        if (active) setName(user.displayName || 'Player')
      })
    return () => {
      active = false
    }
  }, [user])
  const mode = game?.mode ?? 'classic'
  const seconds = game
    ? Math.max(1, elapsedSeconds(game, game.completedAt ?? game.startedAt ?? 0))
    : 0
  return (
    <>
      <Ranking aria-label="Global Sudoku leaderboard">
        <header>
          <h2>{mode === 'classic' ? 'Classic' : 'Killer'} leaderboard</h2>
          {game?.completed && !game.scoreSubmitted && (
            <Button onClick={() => setDismissed(false)}>Save this score</Button>
          )}
          <Button onClick={() => setShowRankings((value) => !value)}>
            {showRankings ? 'Hide rankings' : 'Show rankings'}
          </Button>
        </header>
        <p>
          Top completed games from players around the world. Each puzzle can be
          ranked once per player.
        </p>
        {showRankings && (
          <>
            <header>
              <label>
                Period{' '}
                <select
                  aria-label="Ranking period"
                  value={period}
                  onChange={(event) =>
                    setPeriod(event.target.value as RankingPeriod)
                  }
                >
                  <option value="day">Today</option>
                  <option value="week">This week</option>
                  <option value="month">This month</option>
                  <option value="all">All time</option>
                </select>
              </label>
              <Button onClick={() => setRevision((value) => value + 1)}>
                Refresh scores
              </Button>
            </header>
            <RankingRows
              key={`${mode}-${period}-${revision}`}
              mode={mode}
              period={period}
            />
            <p>
              Periods use UTC. Weeks start on Monday. Ties favor the faster
              game.
            </p>
          </>
        )}
      </Ranking>
      <Modal
        open={Boolean(game?.completed && !dismissed)}
        onOpenChange={handleOpenChange}
        label="Puzzle complete"
      >
        <Modal.Header>
          <h2>Puzzle complete</h2>
        </Modal.Header>
        <Modal.Content>
          <ScoreForm
            onSubmit={async (event) => {
              event.preventDefault()
              if (!game || saving || loading) return
              setSaving(true)
              setMessage('')
              try {
                const { submitScore } =
                  await import('@/features/sudoku/leaderboardService')
                await submitScore(game, name, user?.uid ?? null)
                onSaved(game)
                setSaved(true)
                setMessage('Your score is saved.')
                setRevision((value) => value + 1)
              } catch (error) {
                setMessage(
                  error instanceof Error && !('code' in error)
                    ? error.message
                    : 'Your score could not be saved. Please try again. Your completed game is saved on this browser.'
                )
              } finally {
                setSaving(false)
              }
            }}
          >
            <p>
              {game?.startedAt === undefined
                ? 'This older game was not timed. Start a new puzzle to earn a ranked score.'
                : `${calculateScore(game!.difficulty, seconds, game!.mistakes).toLocaleString()} points · ${formatTime(seconds)} · ${game!.mistakes} mistakes`}
            </p>
            {game?.startedAt !== undefined && !saved && (
              <>
                <label>
                  {user ? 'Player name' : 'Your name'}
                  <input
                    aria-label="Leaderboard name"
                    autoComplete="nickname"
                    minLength={2}
                    maxLength={24}
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={saving}
                  />
                </label>
                <small>
                  Your name and game result will be public on the leaderboard.
                </small>
              </>
            )}
            <p role="status">{message}</p>
            <small>
              Easy: 1,000 base points. Medium: 2,000. Hard: 3,000. Add up to 600
              speed points; subtract 100 per mistake.
            </small>
            <footer>
              {game?.startedAt !== undefined && !saved && (
                <Button
                  type="submit"
                  disabled={saving || loading || name.trim().length < 2}
                >
                  {saving ? 'Saving…' : 'Save score'}
                </Button>
              )}
              <Button type="button" onClick={() => setDismissed(true)}>
                {saved
                  ? 'Done'
                  : saving
                    ? 'Continue'
                    : 'Continue without saving'}
              </Button>
            </footer>
          </ScoreForm>
        </Modal.Content>
      </Modal>
    </>
  )
}
