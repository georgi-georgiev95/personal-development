import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createWatchlistViewModel } from './Watchlist.viewmodel'
import type { WatchlistVM } from './Watchlist.viewmodel'
import type { EventBus } from '@/core/event-bus'

const mockEventBus: EventBus = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
} as unknown as EventBus

describe('WatchlistViewModel', () => {
  let vm: WatchlistVM

  beforeEach(() => {
    vi.clearAllMocks()
    vm = createWatchlistViewModel(mockEventBus)
  })

  it('has correct initial state', () => {
    expect(vm.getState()).toStrictEqual({
      items: [],
      inputValue: '',
      loading: false,
      error: null,
      suggestions: [],
      suggestionsLoading: false,
    })
  })

  it('setInputValue updates inputValue and clears error', () => {
    vm.setInputValue('AAPL')
    expect(vm.getState().inputValue).toBe('AAPL')
    expect(vm.getState().error).toBeNull()
  })

  it('addItem adds a new item and clears inputValue', () => {
    vm.setInputValue('AAPL')
    vm.addItem()
    const { items, inputValue } = vm.getState()
    expect(items).toHaveLength(1)
    expect(items[0].symbol).toBe('AAPL')
    expect(inputValue).toBe('')
  })

  it('addItem uppercases the symbol', () => {
    vm.setInputValue('aapl')
    vm.addItem()
    expect(vm.getState().items[0].symbol).toBe('AAPL')
  })

  it('addItem does nothing when inputValue is empty', () => {
    vm.addItem()
    expect(vm.getState().items).toHaveLength(0)
  })

  it('addItem sets error when symbol already exists', () => {
    vm.setInputValue('AAPL')
    vm.addItem()
    vm.setInputValue('AAPL')
    vm.addItem()
    expect(vm.getState().items).toHaveLength(1)
    expect(vm.getState().error).toMatch(/AAPL/)
  })

  it('removeItem removes the correct item', () => {
    vm.setInputValue('AAPL')
    vm.addItem()
    vm.setInputValue('TSLA')
    vm.addItem()
    const id = vm.getState().items[0].id
    vm.removeItem(id)
    const { items } = vm.getState()
    expect(items).toHaveLength(1)
    expect(items[0].symbol).toBe('TSLA')
  })

  it('removeItem clears error', () => {
    vm.setInputValue('AAPL')
    vm.addItem()
    vm.setInputValue('AAPL')
    vm.addItem() // triggers duplicate error
    const id = vm.getState().items[0].id
    vm.removeItem(id)
    expect(vm.getState().error).toBeNull()
  })
})
