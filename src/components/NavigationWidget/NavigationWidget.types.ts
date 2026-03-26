export interface NavigationWidgetProps {
  /** Slot for a logo or app title override */
  appTitle?: string
}

export interface NavigationWidgetState {
  catalogueOpen: boolean
  activeWidgetIds: string[]
}

/** Describes a widget available in the catalogue */
export interface WidgetCatalogueEntry {
  id: string
  label: string
  description: string
  /** If true, the widget only appears when the user is logged in */
  requiresAuth?: boolean
}
