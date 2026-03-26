import type React from 'react'
import { ProfileWidget } from '@/components/ProfileWidget'
import { Watchlist } from '@/components/Watchlist'

/**
 * Registry of all mountable widgets.
 * Key: widgetId (must match WidgetCatalogueEntry.id in NavigationWidget.viewmodel.ts)
 * Value: React component to render
 *
 * Add new widgets here after running `npm run generate <WidgetName>`.
 */
export const WIDGET_REGISTRY: Readonly<Record<string, React.ComponentType>> = {
  ProfileWidget,
  Watchlist,
} as const
