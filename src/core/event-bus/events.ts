/**
 * Global typed event map for all widget-to-widget communication.
 *
 * Rules:
 * - All event names follow the pattern `<namespace>:<action>`
 * - Payload must be a concrete type (never `any` or `unknown`)
 * - Use `void` for events that carry no payload
 * - Add new widget events here when creating a new widget
 */
export interface WidgetEvents {
  // Auth events
  'auth:login': { uid: string; email: string | null }
  'auth:logout': void

  // Profile widget events
  'profile:updated': {
    displayName: string
    photoURL: string | null | undefined
  }

  // Navigation widget events
  'navigation:widget-added': { widgetId: string }
  'navigation:widget-removed': { widgetId: string; instanceId: string }
}
