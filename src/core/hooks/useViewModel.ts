import { useMemo } from 'react'
import { container } from '@/core/di'

/**
 * Hook to resolve a dependency from the DI container.
 * For transient-scoped bindings a new instance is created per component mount.
 *
 * @param token - The Symbol token registered in src/core/di/tokens.ts
 */
export function useViewModel<T>(token: symbol): T {
  const instance = useMemo(() => container.get<T>(token), [token])
  return instance
}
