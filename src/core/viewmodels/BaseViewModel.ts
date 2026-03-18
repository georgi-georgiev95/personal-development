/**
 * Base class for ViewModels with observable state
 */
export abstract class BaseViewModel<S> {
  protected _state: S
  private _listeners: Set<() => void> = new Set()

  constructor(initialState: S) {
    this._state = initialState
  }

  get state(): S {
    return this._state
  }

  protected setState(newState: Partial<S>): void {
    this._state = { ...this._state, ...newState }
    this._notifyListeners()
  }

  subscribe(listener: () => void): () => void {
    this._listeners.add(listener)
    return () => this._listeners.delete(listener)
  }

  private _notifyListeners(): void {
    this._listeners.forEach((listener) => listener())
  }

  /**
   * Override in subclass for cleanup
   */
  dispose(): void {
    this._listeners.clear()
  }
}
