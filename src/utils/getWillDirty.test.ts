import type { Traits } from '@nanosh/types/traits'
import { describe, expect, it } from 'bun:test'
import seedrandom from 'seedrandom'
import { GetWillDirty } from './getWillDirty'

describe('GetWillDirty', () => {
  it.each([
    [new Set<Traits>(['trait.amorous']), true],
    [new Set<Traits>(['trait.droid']), false],
  ])(
    'should determine whether a character will get dirty or not',
    (traits, result) => {
      const prng = seedrandom(`grow-test-dirty-1235`)
      expect(GetWillDirty(traits, prng)).toBe(result)
    },
  )
})
