import { useState, useEffect, useMemo } from 'react'
import { container } from '@/core/di'
import type { InjectionToken } from 'tsyringe'

/**
 * Hook to resolve a ViewModel from the DI container
 * Creates a new instance per component mount
 */
export function useViewModel<T>(token: InjectionToken<T>): T {
  const viewModel = useMemo(() => container.resolve(token), [token])
  return viewModel
}

/**
 * Hook to use a ViewModel with reactive state
 * The ViewModel should expose a `state` property and `subscribe` method
 */
export function useViewModelState<T, S>(
  token: InjectionToken<T>,
  getState: (vm: T) => S
): [S, T] {
  const viewModel = useViewModel(token)
  const [state, setState] = useState<S>(() => getState(viewModel))

  useEffect(() => {
    // If viewModel has subscribe method, use it for reactivity
    const vm = viewModel as { subscribe?: (cb: () => void) => () => void }
    if (typeof vm.subscribe === 'function') {
      return vm.subscribe(() => setState(getState(viewModel)))
    }
  }, [viewModel, getState])

  return [state, viewModel]
}
