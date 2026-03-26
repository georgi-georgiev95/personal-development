export interface WatchlistItem {
  id: string
  symbol: string
  price: number | null
  change: number | null
  changePercent: number | null
}

export interface WatchlistProps {
  // no external props needed
}

export interface SymbolSuggestion {
  symbol: string
  name: string
  exchange: string
  type: string
}

export interface WatchlistState {
  items: WatchlistItem[]
  inputValue: string
  loading: boolean
  error: string | null
  suggestions: SymbolSuggestion[]
  suggestionsLoading: boolean
}
