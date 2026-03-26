import { createViewModelStore } from '@/core/viewmodels'
import type { ViewModelStore } from '@/core/viewmodels'
import type { EventBus } from '@/core/event-bus'
import type { WatchlistItem, WatchlistState } from './Watchlist.types'
import {
  fetchQuote,
  searchSymbols,
  type SymbolSearchResult,
} from '@/services/stockService'

const initialState: WatchlistState = {
  items: [],
  inputValue: '',
  loading: false,
  error: null,
  suggestions: [],
  suggestionsLoading: false,
}

export interface WatchlistVM extends ViewModelStore<WatchlistState> {
  setInputValue: (value: string) => void
  addItem: () => void
  addSymbol: (symbol: string) => void
  removeItem: (id: string) => void
  refreshAll: () => void
  clearSuggestions: () => void
}

export function createWatchlistViewModel(eventBus: EventBus): WatchlistVM {
  void eventBus
  const store = createViewModelStore<WatchlistState>(initialState)
  let nextId = 1
  let searchTimer: ReturnType<typeof setTimeout> | null = null

  const fetchAndUpdateQuote = async (item: WatchlistItem): Promise<void> => {
    try {
      const quote = await fetchQuote(item.symbol)
      const items = store.getState().items.map((i) =>
        i.id === item.id
          ? {
              ...i,
              price: quote.price,
              change: quote.change,
              changePercent: quote.changePercent,
            }
          : i
      )
      store.setState({ items })
    } catch {
      // Silently skip — item stays with null price
    }
  }

  const debouncedSearch = (query: string): void => {
    if (searchTimer) clearTimeout(searchTimer)
    if (!query.trim()) {
      store.setState({ suggestions: [], suggestionsLoading: false })
      return
    }
    store.setState({ suggestionsLoading: true })
    searchTimer = setTimeout(() => {
      void searchSymbols(query).then((results: SymbolSearchResult[]) => {
        // Only update if the input hasn't changed since we started
        if (
          store.getState().inputValue.trim().toLowerCase() ===
          query.trim().toLowerCase()
        ) {
          store.setState({ suggestions: results, suggestionsLoading: false })
        }
      })
    }, 300)
  }

  const setInputValue = (value: string): void => {
    store.setState({ inputValue: value, error: null })
    debouncedSearch(value)
  }

  const addSymbolInternal = (symbol: string): void => {
    const upper = symbol.trim().toUpperCase()
    if (!upper) return

    const duplicate = store.getState().items.some((i) => i.symbol === upper)
    if (duplicate) {
      store.setState({
        error: `${upper} is already on your watchlist.`,
        suggestions: [],
        inputValue: '',
      })
      return
    }

    const newItem: WatchlistItem = {
      id: String(nextId++),
      symbol: upper,
      price: null,
      change: null,
      changePercent: null,
    }

    store.setState({
      items: [...store.getState().items, newItem],
      inputValue: '',
      error: null,
      suggestions: [],
    })

    void fetchAndUpdateQuote(newItem)
  }

  const addItem = (): void => {
    addSymbolInternal(store.getState().inputValue)
  }

  const addSymbol = (symbol: string): void => {
    addSymbolInternal(symbol)
  }

  const removeItem = (id: string): void => {
    store.setState({
      items: store.getState().items.filter((i) => i.id !== id),
      error: null,
    })
  }

  const refreshAll = (): void => {
    const { items } = store.getState()
    store.setState({ loading: true, error: null })
    Promise.all(items.map((item) => fetchAndUpdateQuote(item)))
      .catch(() => {
        store.setState({ error: 'Failed to refresh some quotes.' })
      })
      .finally(() => {
        store.setState({ loading: false })
      })
  }

  const clearSuggestions = (): void => {
    store.setState({ suggestions: [] })
  }

  return {
    ...store,
    setInputValue,
    addItem,
    addSymbol,
    removeItem,
    refreshAll,
    clearSuggestions,
  }
}
