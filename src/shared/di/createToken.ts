export interface Token<T> {
  readonly id: symbol
  readonly description: string
  /** Phantom field: never set at runtime, only carries T for type inference. */
  readonly __type?: T
}

export const createToken = <T>(description: string): Token<T> => ({
  id: Symbol(description),
  description,
})
