import React, { useEffect, useState, useRef } from 'react'
import { useViewModel } from '@/core/hooks'
import { TOKENS } from '@/core/di'
import type { WatchlistVM } from './Watchlist.viewmodel'
import type { WatchlistState } from './Watchlist.types'
import {
  Container,
  WidgetTitle,
  TitleRow,
  InputRow,
  SymbolInput,
  AddButton,
  ItemList,
  ItemRow,
  ItemSymbol,
  ItemPrice,
  ItemChange,
  RemoveBtn,
  RefreshButton,
  ErrorMessage,
  EmptyMessage,
  SuggestionsDropdown,
  SuggestionItem,
  SuggestionSymbol,
  SuggestionName,
  SearchWrapper,
} from './Watchlist.styles'

export const Watchlist: React.FC = () => {
  const vm = useViewModel<WatchlistVM>(TOKENS.WatchlistViewModel)
  const [state, setLocalState] = useState<WatchlistState>(vm.getState())
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = vm.subscribe(() => {
      setLocalState({ ...vm.getState() })
    })
    return () => {
      unsubscribe()
      vm.dispose()
    }
  }, [vm])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        vm.clearSuggestions()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [vm])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') vm.addItem()
    if (e.key === 'Escape') vm.clearSuggestions()
  }

  return (
    <Container>
      <TitleRow>
        <WidgetTitle>Watchlist</WidgetTitle>
        {state.items.length > 0 && (
          <RefreshButton
            onClick={() => vm.refreshAll()}
            disabled={state.loading}
          >
            {state.loading ? 'Refreshing…' : '↻ Refresh'}
          </RefreshButton>
        )}
      </TitleRow>

      <SearchWrapper ref={wrapperRef}>
        <InputRow>
          <SymbolInput
            type="text"
            placeholder="Search symbol or company…"
            value={state.inputValue}
            onChange={(e) => vm.setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Stock symbol"
            maxLength={20}
          />
          <AddButton
            onClick={() => vm.addItem()}
            disabled={!state.inputValue.trim()}
          >
            + Add
          </AddButton>
        </InputRow>

        {state.suggestions.length > 0 && (
          <SuggestionsDropdown>
            {state.suggestions.map((s) => (
              <SuggestionItem
                key={s.symbol}
                onClick={() => vm.addSymbol(s.symbol)}
              >
                <SuggestionSymbol>{s.symbol}</SuggestionSymbol>
                <SuggestionName>
                  {s.name}
                  {s.exchange ? ` · ${s.exchange}` : ''}
                </SuggestionName>
              </SuggestionItem>
            ))}
          </SuggestionsDropdown>
        )}
      </SearchWrapper>

      {state.error && <ErrorMessage>{state.error}</ErrorMessage>}

      {state.items.length === 0 ? (
        <EmptyMessage>No symbols yet. Type a ticker above.</EmptyMessage>
      ) : (
        <ItemList>
          {state.items.map((item) => {
            const positive = (item.changePercent ?? 0) >= 0
            const changeColor = positive ? '#4caf50' : '#f44336'
            return (
              <ItemRow key={item.id}>
                <ItemSymbol>{item.symbol}</ItemSymbol>
                <ItemPrice>
                  {item.price !== null ? `$${item.price.toFixed(2)}` : '—'}
                </ItemPrice>
                <ItemChange style={{ color: changeColor }}>
                  {item.changePercent !== null
                    ? `${positive ? '+' : ''}${item.changePercent.toFixed(2)}%`
                    : '—'}
                </ItemChange>
                <RemoveBtn
                  onClick={() => vm.removeItem(item.id)}
                  aria-label={`Remove ${item.symbol}`}
                  title={`Remove ${item.symbol}`}
                >
                  ×
                </RemoveBtn>
              </ItemRow>
            )
          })}
        </ItemList>
      )}
    </Container>
  )
}
