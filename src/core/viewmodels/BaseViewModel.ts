/**
 * Observable state store used by functional ViewModels.
 * Created via createViewModel() — no classes, no decorators.
 */
export interface ViewModelStore<S> {
  /** Current snapshot of the state */
  getState: () => S
  /** Merge partial state and notify subscribers */
  setState: (partial: Partial<S>) => void
  /** Register a listener; returns an unsubscribe function */
  subscribe: (listener: () => void) => () => void
  /** Unsubscribe all listeners */
  dispose: () => void
}

/**
 * Creates an observable state store for a functional ViewModel.
 *
 * @param initialState - The initial state snapshot
 * @returns A ViewModelStore with getState / setState / subscribe / dispose
 */
export function createViewModelStore<S>(initialState: S): ViewModelStore<S> {
  let state: S = initialState
  const listeners = new Set<() => void>()

  const notify = (): void => {
    listeners.forEach((listener) => listener())
  }

  return {
    getState: () => state,
    setState: (partial: Partial<S>) => {
      state = { ...state, ...partial }
      notify()
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    dispose: () => {
      listeners.clear()
    },
  }
}
