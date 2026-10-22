import { expect, it } from 'vitest'
import { cageOutline } from './cages'

it('draws a joined rectangle across adjacent cells without internal cage edges', () => {
  expect(cageOutline([0, 1])).toBe('M 6 6 L 194 6 L 194 94 L 6 94 Z')
})

it('keeps the inward corner of an L cage connected in a single closed path', () => {
  expect(cageOutline([0, 9, 10])).toBe(
    'M 6 6 L 94 6 L 94 106 L 194 106 L 194 194 L 6 194 Z'
  )
})
