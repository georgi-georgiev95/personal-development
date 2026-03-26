import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createNavigationWidgetViewModel } from './NavigationWidget.viewmodel'
import type { NavigationWidgetVM } from './NavigationWidget.viewmodel'
import type { EventBus } from '@/core/event-bus'

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockEmit = vi.fn()
const mockEventBus: EventBus = {
  on: vi.fn(),
  off: vi.fn(),
  emit: mockEmit,
} as unknown as EventBus

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('NavigationWidgetViewModel', () => {
  let vm: NavigationWidgetVM

  beforeEach(() => {
    vi.clearAllMocks()
    vm = createNavigationWidgetViewModel(mockEventBus)
  })

  it('has correct initial state', () => {
    expect(vm.getState()).toStrictEqual({
      catalogueOpen: false,
      activeWidgetIds: [],
    })
  })

  it('openCatalogue sets catalogueOpen to true', () => {
    vm.openCatalogue()
    expect(vm.getState().catalogueOpen).toBe(true)
  })

  it('closeCatalogue sets catalogueOpen to false', () => {
    vm.openCatalogue()
    vm.closeCatalogue()
    expect(vm.getState().catalogueOpen).toBe(false)
  })

  it('toggleCatalogue flips catalogueOpen', () => {
    vm.toggleCatalogue()
    expect(vm.getState().catalogueOpen).toBe(true)
    vm.toggleCatalogue()
    expect(vm.getState().catalogueOpen).toBe(false)
  })

  describe('addWidget', () => {
    it('adds widgetId to activeWidgetIds and closes catalogue', () => {
      vm.openCatalogue()
      vm.addWidget('ProfileWidget')

      expect(vm.getState().activeWidgetIds).toContain('ProfileWidget')
      expect(vm.getState().catalogueOpen).toBe(false)
    })

    it('allows multiple instances of the same widget', () => {
      vm.addWidget('ProfileWidget')
      vm.addWidget('ProfileWidget')

      expect(vm.getState().activeWidgetIds).toHaveLength(2)
    })

    it('emits navigation:widget-added event', () => {
      vm.addWidget('ProfileWidget')

      expect(mockEmit).toHaveBeenCalledWith('navigation:widget-added', {
        widgetId: 'ProfileWidget',
      })
    })
  })

  describe('removeWidget', () => {
    it('emits navigation:widget-removed event', () => {
      vm.removeWidget('ProfileWidget', 'instance-abc')

      expect(mockEmit).toHaveBeenCalledWith('navigation:widget-removed', {
        widgetId: 'ProfileWidget',
        instanceId: 'instance-abc',
      })
    })
  })
})
