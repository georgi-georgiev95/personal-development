import { describe, it, expect } from 'vitest'
import { createToken } from './createToken'

describe('createToken', () => {
  it('creates a token carrying the given description', () => {
    const token = createToken<string>('MyToken')

    expect(token.description).toBe('MyToken')
  })

  it('creates a unique symbol id for each call, even with the same description', () => {
    const tokenA = createToken<string>('SameName')
    const tokenB = createToken<string>('SameName')

    expect(tokenA.id).not.toBe(tokenB.id)
  })
})
