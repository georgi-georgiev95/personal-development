// Central DI registration for app viewmodels
import { bindTransient } from './container'
import { TOKENS } from './tokens'

// Import viewmodels here and bind them. Use ES imports so Vite/browser can resolve.
import { OptimusRobotViewModel } from '@/components/OptimusRobot'

// Bind OptimusRobotViewModel as transient
bindTransient<OptimusRobotViewModel>(
  TOKENS.OptimusRobotViewModel,
  OptimusRobotViewModel
)

export default null
