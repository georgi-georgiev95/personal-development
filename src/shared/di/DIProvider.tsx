import React, { useMemo } from 'react'
import type { Token } from './createToken'
import { DIContext } from './DIContext'

export type Binding<T> = [Token<T>, T]

interface DIProviderProps {
  bindings: Binding<unknown>[]
  children: React.ReactNode
}

export const DIProvider: React.FC<DIProviderProps> = ({
  bindings,
  children,
}) => {
  const map = useMemo(() => {
    const nextMap = new Map<symbol, unknown>()
    for (const [token, implementation] of bindings) {
      nextMap.set(token.id, implementation)
    }
    return nextMap
  }, [bindings])

  return <DIContext.Provider value={map}>{children}</DIContext.Provider>
}
