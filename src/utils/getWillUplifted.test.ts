import type {
  ModifierTracker,
  ModifiersCharacter,
} from '@nanosh/types/modifiers'
import type { Traits } from '@nanosh/types/traits'
import { describe, expect, it } from 'bun:test'
import { GetWillUplifted } from './getWillUplifted'

describe('GetWillDirty', () => {
  it.each([
    [
      new Set<Traits>(['trait.amorous']),
      new Map<ModifiersCharacter, ModifierTracker>([
        [
          'character.cycle.frustrated',
          {
            start: { day: 1, cycle: 1 },
            expiry: { day: -1, cycle: -1 },
            amount: 1,
          },
        ],
      ]),
      true,
    ],
    [
      new Set<Traits>(['trait.amorous']),
      new Map<ModifiersCharacter, ModifierTracker>(),
      false,
    ],
    [
      new Set<Traits>(['trait.droid', 'trait.amorous']),
      new Map<ModifiersCharacter, ModifierTracker>([
        [
          'character.cycle.frustrated',
          {
            start: { day: 1, cycle: 1 },
            expiry: { day: -1, cycle: -1 },
            amount: 1,
          },
        ],
      ]),
      false,
    ],
  ])(
    'should determine whether a character will get dirty or not',
    (traits, modifiers, result) => {
      expect(GetWillUplifted(traits, modifiers)).toBe(result)
    },
  )
})
