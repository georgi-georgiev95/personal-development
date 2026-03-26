import { EventBus } from '@/core/event-bus'
import { TOKENS } from './tokens'
import { createProfileWidgetViewModel } from '@/components/ProfileWidget/ProfileWidget.viewmodel'
import { createNavigationWidgetViewModel } from '@/components/NavigationWidget/NavigationWidget.viewmodel'
import { createWatchlistViewModel } from '@/components/Watchlist/Watchlist.viewmodel'

type Factory<T> = () => T
type Scope = 'singleton' | 'transient'

interface Binding<T> {
  factory: Factory<T>
  scope: Scope
  instance?: T
}

/**
 * Lightweight DI container — no decorators, no reflect-metadata.
 * Singletons are created once; transients create a new instance per .get() call.
 */
class ServiceContainer {
  private bindings = new Map<symbol, Binding<unknown>>()

  bind<T>(
    token: symbol,
    factory: Factory<T>,
    scope: Scope = 'transient'
  ): void {
    this.bindings.set(token, { factory: factory as Factory<unknown>, scope })
  }

  get<T>(token: symbol): T {
    const binding = this.bindings.get(token)
    if (!binding) {
      throw new Error(`No binding found for token: ${String(token)}`)
    }

    if (binding.scope === 'singleton') {
      if (!binding.instance) {
        binding.instance = binding.factory()
      }
      return binding.instance as T
    }

    return binding.factory() as T
  }
}

const container = new ServiceContainer()

// Core singletons
container.bind<EventBus>(TOKENS.EventBus, () => new EventBus(), 'singleton')

// Widget ViewModels (transient — new instance per component mount)
container.bind(
  TOKENS.ProfileWidgetViewModel,
  () => createProfileWidgetViewModel(container.get<EventBus>(TOKENS.EventBus)),
  'transient'
)

container.bind(
  TOKENS.NavigationWidgetViewModel,
  () =>
    createNavigationWidgetViewModel(container.get<EventBus>(TOKENS.EventBus)),
  'transient'
)

container.bind(
  TOKENS.WatchlistViewModel,
  () => createWatchlistViewModel(container.get<EventBus>(TOKENS.EventBus)),
  'transient'
)

export { container, ServiceContainer }
