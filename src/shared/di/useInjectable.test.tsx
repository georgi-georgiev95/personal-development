import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { createToken } from './createToken'
import { DIProvider, type Binding } from './DIProvider'
import { useInjectable } from './useInjectable'

describe('useInjectable', () => {
  it('resolves the implementation bound to a token', () => {
    const greetToken = createToken<() => string>('Greet')
    const greet = () => 'hello'
    const bindings: Binding<unknown>[] = [[greetToken, greet]]

    const { result } = renderHook(() => useInjectable(greetToken), {
      wrapper: ({ children }) => (
        <DIProvider bindings={bindings}>{children}</DIProvider>
      ),
    })

    expect(result.current).toBe(greet)
  })

  it('throws when used outside a DIProvider', () => {
    const token = createToken<() => void>('Unbound')

    expect(() => renderHook(() => useInjectable(token))).toThrow(
      'useInjectable must be used within a DIProvider'
    )
  })

  it('throws when no binding was registered for the token', () => {
    const boundToken = createToken<() => void>('Bound')
    const unboundToken = createToken<() => void>('Unbound')
    const bindings: Binding<unknown>[] = [[boundToken, () => {}]]

    expect(() =>
      renderHook(() => useInjectable(unboundToken), {
        wrapper: ({ children }) => (
          <DIProvider bindings={bindings}>{children}</DIProvider>
        ),
      })
    ).toThrow('No binding found for token "Unbound"')
  })
})
