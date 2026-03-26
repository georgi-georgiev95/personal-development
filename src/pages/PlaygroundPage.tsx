import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useViewModel } from '@/core/hooks'
import { TOKENS, container } from '@/core/di'
import { NavigationWidget } from '@/components/NavigationWidget'
import type { NavigationWidgetVM } from '@/components/NavigationWidget/NavigationWidget.viewmodel'
import type { EventBus, WidgetEvents } from '@/core/event-bus'
import { WIDGET_REGISTRY } from './widgetRegistry'
import {
  PageWrapper,
  WidgetGrid,
  WidgetSlot,
  WidgetHeader,
  WidgetBody,
  RemoveButton,
  ExpandButton,
  EmptyState,
  EmptyStateTitle,
  EmptyStateSubtitle,
} from './PlaygroundPage.styles'

interface MountedWidget {
  instanceId: string
  widgetId: string
  expanded: boolean
}

export const PlaygroundPage: React.FC = () => {
  const navViewModel = useViewModel<NavigationWidgetVM>(
    TOKENS.NavigationWidgetViewModel
  )
  const [mountedWidgets, setMountedWidgets] = useState<MountedWidget[]>([])
  const instanceCounter = useRef(0)

  useEffect(() => {
    const eventBus = container.get<EventBus>(TOKENS.EventBus)

    const offAdd = eventBus.on(
      'navigation:widget-added',
      (payload: WidgetEvents['navigation:widget-added']) => {
        instanceCounter.current += 1
        const instanceId = `${payload.widgetId}-${instanceCounter.current}`
        setMountedWidgets((prev) => [
          ...prev,
          { instanceId, widgetId: payload.widgetId, expanded: false },
        ])
      }
    )

    const offRemove = eventBus.on(
      'navigation:widget-removed',
      (payload: WidgetEvents['navigation:widget-removed']) => {
        setMountedWidgets((prev) =>
          prev.filter((w) => w.instanceId !== payload.instanceId)
        )
      }
    )

    return () => {
      offAdd()
      offRemove()
    }
  }, [])

  const handleRemove = (widget: MountedWidget): void => {
    navViewModel.removeWidget(widget.widgetId, widget.instanceId)
  }

  const toggleExpand = useCallback((instanceId: string) => {
    setMountedWidgets((prev) =>
      prev.map((w) =>
        w.instanceId === instanceId ? { ...w, expanded: !w.expanded } : w
      )
    )
  }, [])

  return (
    <PageWrapper>
      <NavigationWidget />

      <WidgetGrid>
        {mountedWidgets.length === 0 ? (
          <EmptyState>
            <EmptyStateTitle>No widgets mounted</EmptyStateTitle>
            <EmptyStateSubtitle>
              Click <strong>+ Add Widget</strong> in the navigation bar to add a
              widget to the playground.
            </EmptyStateSubtitle>
          </EmptyState>
        ) : (
          mountedWidgets.map((widget) => {
            const WidgetComponent = WIDGET_REGISTRY[widget.widgetId]
            if (!WidgetComponent) return null
            return (
              <WidgetSlot
                key={widget.instanceId}
                data-expanded={widget.expanded}
              >
                <WidgetHeader>
                  <ExpandButton
                    onClick={() => toggleExpand(widget.instanceId)}
                    title={
                      widget.expanded ? 'Collapse widget' : 'Expand widget'
                    }
                    aria-label={`${widget.expanded ? 'Collapse' : 'Expand'} ${widget.widgetId}`}
                  >
                    {widget.expanded ? '⤡' : '⤢'}
                  </ExpandButton>
                  <RemoveButton
                    onClick={() => handleRemove(widget)}
                    title="Remove widget"
                    aria-label={`Remove ${widget.widgetId}`}
                  >
                    ×
                  </RemoveButton>
                </WidgetHeader>
                <WidgetBody>
                  <WidgetComponent />
                </WidgetBody>
              </WidgetSlot>
            )
          })
        )}
      </WidgetGrid>
    </PageWrapper>
  )
}
