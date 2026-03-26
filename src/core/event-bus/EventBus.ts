import type { WidgetEvents } from './events'

type EventHandler<T> = (payload: T) => void

/**
 * Typed publish/subscribe event bus for cross-widget communication.
 *
 * Widgets must NEVER import each other directly.
 * All cross-widget communication must go through the EventBus.
 *
 * Registered as a singleton in the DI container.
 * Resolve via TOKENS.EventBus.
 *
 * @example
 * // Emit
 * eventBus.emit('profile:updated', { displayName: 'Alice', photoURL: null })
 *
 * // Subscribe (return value is the unsubscribe function)
 * const off = eventBus.on('profile:updated', (payload) => { ... })
 * // Call off() to clean up
 */
export class EventBus {
  private readonly listeners = new Map<string, Set<EventHandler<unknown>>>()

  /**
   * Subscribe to a typed event.
   * @returns Unsubscribe function — call it in ViewModel.dispose() or useEffect cleanup.
   */
  on<K extends keyof WidgetEvents>(
    event: K,
    handler: EventHandler<WidgetEvents[K]>
  ): () => void {
    if (!this.listeners.has(event as string)) {
      this.listeners.set(event as string, new Set())
    }
    const handlers = this.listeners.get(event as string)!
    handlers.add(handler as EventHandler<unknown>)

    return () => this.off(event, handler)
  }

  /**
   * Unsubscribe a handler from a typed event.
   */
  off<K extends keyof WidgetEvents>(
    event: K,
    handler: EventHandler<WidgetEvents[K]>
  ): void {
    this.listeners
      .get(event as string)
      ?.delete(handler as EventHandler<unknown>)
  }

  /**
   * Emit a typed event to all registered handlers.
   */
  emit<K extends keyof WidgetEvents>(event: K, payload: WidgetEvents[K]): void {
    this.listeners.get(event as string)?.forEach((handler) => {
      ;(handler as EventHandler<WidgetEvents[K]>)(payload)
    })
  }
}
