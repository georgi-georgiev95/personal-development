import { useMemo } from 'react'
import { getTransient } from '@/core/di/container'

export function useViewModel<T>(token: symbol): T {
  // create a new instance per component mount (transient)
  return useMemo(() => getTransient<T>(token), [token])
}

export default useViewModel
