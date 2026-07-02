import React, { useEffect, useRef } from 'react'
import { theme } from '@/shared/styles/theme'
import type { SnakeGameState } from '@/entities/snake'
import { BoardCanvas } from './SnakeBoard.styles'

interface SnakeBoardProps {
  game: SnakeGameState
}

const GRID_LINE = 'rgba(255, 255, 255, 0.05)'
const CELL_INSET = 1.5

const fillCell = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cell: number
): void => {
  const size = cell - CELL_INSET * 2
  const px = x * cell + CELL_INSET
  const py = y * cell + CELL_INSET
  const radius = Math.min(4, size / 3)
  ctx.beginPath()
  ctx.roundRect(px, py, size, size, radius)
  ctx.fill()
}

const drawBoard = (canvas: HTMLCanvasElement, game: SnakeGameState): void => {
  const size = canvas.clientWidth
  const ctx = canvas.getContext('2d')
  if (!ctx || size === 0) {
    return
  }

  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.round(size * dpr)
  canvas.height = Math.round(size * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, size, size)

  const cell = size / game.cols

  ctx.strokeStyle = GRID_LINE
  ctx.lineWidth = 1
  for (let line = 1; line < game.cols; line += 1) {
    const at = line * cell
    ctx.beginPath()
    ctx.moveTo(at, 0)
    ctx.lineTo(at, size)
    ctx.moveTo(0, at)
    ctx.lineTo(size, at)
    ctx.stroke()
  }

  if (game.food) {
    ctx.fillStyle = theme.colors.secondary
    ctx.shadowColor = theme.colors.secondary
    ctx.shadowBlur = cell / 2
    ctx.beginPath()
    ctx.arc(
      game.food.x * cell + cell / 2,
      game.food.y * cell + cell / 2,
      cell / 2 - CELL_INSET * 2,
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.shadowBlur = 0
  }

  // Head in full accent; the body fades towards the tail.
  ctx.fillStyle = theme.colors.primary
  game.snake.forEach((segment, index) => {
    ctx.globalAlpha =
      index === 0 ? 1 : Math.max(0.25, 1 - (index / game.snake.length) * 0.75)
    fillCell(ctx, segment.x, segment.y, cell)
  })
  ctx.globalAlpha = 1
}

/**
 * Pure canvas renderer for the snake grid. Repaints only when the game state
 * changes or the board is resized — there is no per-frame animation loop.
 */
export const SnakeBoard: React.FC<SnakeBoardProps> = ({ game }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef(game)

  useEffect(() => {
    gameRef.current = game
    if (canvasRef.current) {
      drawBoard(canvasRef.current, game)
    }
  }, [game])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }
    const observer = new ResizeObserver(() => {
      drawBoard(canvas, gameRef.current)
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  return (
    <BoardCanvas
      ref={canvasRef}
      role="img"
      aria-label={`Snake board — score ${game.score}`}
    />
  )
}
