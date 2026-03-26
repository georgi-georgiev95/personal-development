import { createViewModelStore } from '@/core/viewmodels'
import type { ViewModelStore } from '@/core/viewmodels'
import type { EventBus } from '@/core/event-bus'
import type {
  NavigationWidgetState,
  WidgetCatalogueEntry,
} from './NavigationWidget.types'

const initialState: NavigationWidgetState = {
  catalogueOpen: false,
  activeWidgetIds: [],
}

/**
 * All widgets available in the playground catalogue.
 * Register new widgets here after running `npm run generate:widget`.
 */
export const WIDGET_CATALOGUE: readonly WidgetCatalogueEntry[] = [
  {
    id: 'ProfileWidget',
    label: 'Profile',
    description: 'View and edit your user profile',
    requiresAuth: true,
  },
  {
    id: 'Watchlist',
    label: 'Watchlist',
    description: 'Track your favourite stock symbols',
  },
] as const

export interface NavigationWidgetVM extends ViewModelStore<NavigationWidgetState> {
  catalogue: readonly WidgetCatalogueEntry[]
  openCatalogue: () => void
  closeCatalogue: () => void
  toggleCatalogue: () => void
  addWidget: (widgetId: string) => void
  removeWidget: (widgetId: string, instanceId: string) => void
}

export function createNavigationWidgetViewModel(
  eventBus: EventBus
): NavigationWidgetVM {
  const store = createViewModelStore<NavigationWidgetState>(initialState)

  return {
    ...store,

    catalogue: WIDGET_CATALOGUE,

    openCatalogue: () => {
      store.setState({ catalogueOpen: true })
    },

    closeCatalogue: () => {
      store.setState({ catalogueOpen: false })
    },

    toggleCatalogue: () => {
      store.setState({ catalogueOpen: !store.getState().catalogueOpen })
    },

    addWidget: (widgetId: string) => {
      store.setState({
        activeWidgetIds: [...store.getState().activeWidgetIds, widgetId],
        catalogueOpen: false,
      })
      eventBus.emit('navigation:widget-added', { widgetId })
    },

    removeWidget: (widgetId: string, instanceId: string) => {
      eventBus.emit('navigation:widget-removed', { widgetId, instanceId })
    },
  }
}
