import { createContext } from 'react'

export const DIContext = createContext<Map<symbol, unknown> | null>(null)
