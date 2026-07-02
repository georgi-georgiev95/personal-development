import React, { useCallback, useRef } from 'react'
import { Button } from '@/shared/ui-kit/Button'
import type { SnakeDirection, SnakeStatus } from '@/entities/snake'
import { SnakeBoard } from '../components/SnakeBoard'
import { useSnakeGame } from '../hooks/useSnakeGame'
import {
  BoardOverlay,
  BoardShell,
  ControlsRow,
  GameLayout,
  HintLine,
  Key,
  KeyboardHint,
  OverlayHint,
  OverlayNote,
  OverlayTitle,
  PageEyebrow,
  PageHeader,
  PageSubtitle,
  PageTitle,
  PageWrapper,
  Stat,
  StatLabel,
  StatsRow,
  StatValue,
  TouchHint,
} from './SnakeGamePage.styles'

/** Anything shorter than this is a tap; anything longer steers the snake. */
const SWIPE_MIN_PX = 24

interface OverlayCopy {
  title: string
  keyboardHint: string
  touchHint: string
  showScore: boolean
}

const OVERLAY_COPY: Partial<Record<SnakeStatus, OverlayCopy>> = {
  idle: {
    title: 'ready?',
    keyboardHint: 'press an arrow key or space to start',
    touchHint: 'swipe or tap the board to start',
    showScore: false,
  },
  paused: {
    title: 'paused',
    keyboardHint: 'press space to resume',
    touchHint: 'tap the board to resume',
    showScore: false,
  },
  'game-over': {
    title: 'game over',
    keyboardHint: 'press enter to play again',
    touchHint: 'tap the board to play again',
    showScore: true,
  },
  won: {
    title: 'board cleared!',
    keyboardHint: 'press enter to play again',
    touchHint: 'tap the board to play again',
    showScore: true,
  },
}

const STATUS_LABEL: Record<SnakeStatus, string> = {
  idle: 'ready',
  running: 'running',
  paused: 'paused',
  'game-over': 'game over',
  won: 'cleared',
}

const PRIMARY_LABEL: Record<SnakeStatus, string> = {
  idle: 'start',
  running: 'pause',
  paused: 'resume',
  'game-over': 'play again',
  won: 'play again',
}

const SnakeGamePage: React.FC = () => {
  const { game, best, start, restart, togglePause, steer } = useSnakeGame()
  const touchOrigin = useRef<{ x: number; y: number } | null>(null)

  const handleTap = useCallback(() => {
    if (game.status === 'idle') {
      start()
    } else if (game.status === 'running' || game.status === 'paused') {
      togglePause()
    } else {
      restart()
    }
  }, [game.status, restart, start, togglePause])

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0]
      touchOrigin.current = { x: touch.clientX, y: touch.clientY }
    },
    []
  )

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const origin = touchOrigin.current
      touchOrigin.current = null
      if (!origin) {
        return
      }
      const touch = event.changedTouches[0]
      const dx = touch.clientX - origin.x
      const dy = touch.clientY - origin.y
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN_PX) {
        handleTap()
        return
      }
      const direction: SnakeDirection =
        Math.abs(dx) > Math.abs(dy)
          ? dx > 0
            ? 'right'
            : 'left'
          : dy > 0
            ? 'down'
            : 'up'
      steer(direction)
    },
    [handleTap, steer]
  )

  const overlay = OVERLAY_COPY[game.status]
  const primaryAction =
    game.status === 'idle'
      ? start
      : game.status === 'running' || game.status === 'paused'
        ? togglePause
        : restart

  return (
    <PageWrapper>
      <PageHeader>
        <PageEyebrow>Mini game</PageEyebrow>
        <PageTitle>Snake</PageTitle>
        <PageSubtitle>
          Chase the glow, dodge the walls — and your own tail. It speeds up as
          you score.
        </PageSubtitle>
      </PageHeader>

      <GameLayout>
        <StatsRow>
          <Stat>
            <StatLabel>score</StatLabel>
            <StatValue>{game.score}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>best</StatLabel>
            <StatValue>{best}</StatValue>
          </Stat>
          <Stat>
            <StatLabel>status</StatLabel>
            <StatValue aria-live="polite">
              {STATUS_LABEL[game.status]}
            </StatValue>
          </Stat>
        </StatsRow>

        <BoardShell onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <SnakeBoard game={game} />
          {overlay && (
            <BoardOverlay>
              <OverlayTitle>{overlay.title}</OverlayTitle>
              {overlay.showScore && (
                <OverlayNote>score {game.score}</OverlayNote>
              )}
              <OverlayHint>
                <KeyboardHint>{overlay.keyboardHint}</KeyboardHint>
                <TouchHint>{overlay.touchHint}</TouchHint>
              </OverlayHint>
            </BoardOverlay>
          )}
        </BoardShell>

        <ControlsRow>
          <Button onClick={primaryAction}>{PRIMARY_LABEL[game.status]}</Button>
        </ControlsRow>

        <HintLine>
          <KeyboardHint>
            <Key>← ↑ ↓ →</Key> or <Key>WASD</Key> steer · <Key>space</Key> start
            / pause · <Key>enter</Key> restart
          </KeyboardHint>
          <TouchHint>
            swipe the board to steer · tap it to pause or play again
          </TouchHint>
        </HintLine>
      </GameLayout>
    </PageWrapper>
  )
}

export default SnakeGamePage
