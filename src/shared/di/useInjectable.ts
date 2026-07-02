import { useContext } from 'react'
import { DIContext } from './DIContext'
import type { Token } from './createToken'

export const useInjectable = <T>(token: Token<T>): T => {
  const bindings = useContext(DIContext)

  if (!bindings) {
    throw new Error('useInjectable must be used within a DIProvider')
  }

  if (!bindings.has(token.id)) {
    throw new Error(`No binding found for token "${token.description}"`)
  }

  return bindings.get(token.id) as T
}
