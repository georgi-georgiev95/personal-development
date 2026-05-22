import type { OptimusRobotState } from './OptimusRobot.types'

type Listener = (s: OptimusRobotState) => void

export class OptimusRobotViewModel {
  private state: OptimusRobotState
  private listeners: Listener[] = []

  constructor() {
    this.state = {
      running: false,
      fighting: false,
      transforming: false,
      transformProgress: 0,
    }
  }

  getState(): OptimusRobotState {
    return { ...this.state }
  }

  subscribe(cb: Listener): () => void {
    this.listeners.push(cb)
    cb(this.getState())
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb)
    }
  }

  private emit(): void {
    const s = this.getState()
    this.listeners.forEach((l) => l(s))
  }

  startRun(): void {
    if (!this.state.running) {
      this.state.running = true
      this.emit()
    }
  }
  stopRun(): void {
    if (this.state.running) {
      this.state.running = false
      this.emit()
    }
  }

  startFight(): void {
    if (!this.state.fighting) {
      this.state.fighting = true
      this.emit()
    }
  }
  stopFight(): void {
    if (this.state.fighting) {
      this.state.fighting = false
      this.emit()
    }
  }

  private transformDirection: 1 | -1 = 1

  startTransform(): void {
    if (!this.state.transforming && this.state.transformProgress < 1) {
      this.transformDirection = 1
      this.state.transforming = true
      this.emit()
    }
  }

  startReverseTransform(): void {
    if (!this.state.transforming && this.state.transformProgress > 0) {
      this.transformDirection = -1
      this.state.transforming = true
      this.emit()
    }
  }

  // advance by fraction (seconds) — direction-aware
  advanceTransform(deltaSeconds: number): void {
    if (!this.state.transforming) return
    const speed = 0.4
    const next =
      this.state.transformProgress +
      this.transformDirection * deltaSeconds * speed
    this.state.transformProgress = Math.max(0, Math.min(1, next))
    if (
      this.state.transformProgress <= 0 ||
      this.state.transformProgress >= 1
    ) {
      this.state.transforming = false
    }
    this.emit()
  }

  reset(): void {
    this.state = {
      running: false,
      fighting: false,
      transforming: false,
      transformProgress: 0,
    }
    this.emit()
  }
}

export default OptimusRobotViewModel
