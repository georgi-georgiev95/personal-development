import { describe, expect, it } from 'vitest'
import { replaceMany } from './objectMutations'

interface State {
  name: string
  count: number
}

type Updates = Partial<{ [K in keyof State]: (state: State) => State[K] }>

describe('replaceMany', () => {
  it('ignores inherited update functions', () => {
    const state = { name: 'Ada', count: 1 }
    const updates = Object.create({
      count: (current: State) => current.count + 1,
    }) as Updates

    expect(replaceMany(state, updates)).toEqual(state)
  })

  it('ignores own update entries without an updater', () => {
    const state = { name: 'Ada', count: 1 }
    const updates = { count: undefined } as Updates

    expect(replaceMany(state, updates)).toEqual(state)
  })
})
