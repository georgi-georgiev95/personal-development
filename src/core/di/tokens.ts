/**
 * Strongly-typed DI tokens for the service container.
 * Every injectable service and widget ViewModel must have a token here.
 */
export const TOKENS = {
  // Core
  EventBus: Symbol.for('EventBus'),

  // Services
  UserService: Symbol.for('UserService'),

  // Widget ViewModels
  ProfileWidgetViewModel: Symbol.for('ProfileWidgetViewModel'),
  NavigationWidgetViewModel: Symbol.for('NavigationWidgetViewModel'),
  WatchlistViewModel: Symbol.for('WatchlistViewModel'),
} as const

export type TokenKey = keyof typeof TOKENS
