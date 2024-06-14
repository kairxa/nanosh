import type { CharacterNames } from '@nanosh/types/character'
import { describe, expect, it } from 'bun:test'
import { GetInitialGame } from './initialState/game'
import KillCharacterFromWoundPerhaps from './killCharacterFromWoundPerhaps'

describe('killCharacterFromWoundPerhaps', () => {
  const [gameState, _] = GetInitialGame(
    'kill-character-from-wound-perhaps',
    12345,
  )

  it.each([
    [false, 2, 'Val', false],
    [false, 3, 'Val', true],
    [false, 3, 'Momo Tzigane', false],
    [false, 4, 'Momo Tzigane', true],
    [true, 1, 'Momo Tzigane', true],
    [true, 2, 'Rina Mikami', false],
    [true, 3, 'Rina Mikami', true],
    [false, 0, 'Alisa Huang', false],
    [false, 9, 'X7-Gastronia "Gass" Petalnova', false],
    [false, 10, 'X7-Gastronia "Gass" Petalnova', true],
    [true, 8, 'X7-Gastronia "Gass" Petalnova', false],
    [true, 10, 'X7-Gastronia "Gass" Petalnova', true],
  ])(
    'if isDayChange is %p, and CW is %p, then character %p dead is %p',
    (isDayChange, cwAmount, characterName, expectedDead) => {
      gameState?.characters
        .get(characterName as CharacterNames)
        ?.modifiers.set('character.wound.critical', {
          start: { day: 1, cycle: 1 },
          expiry: { day: -1, cycle: -1 },
          amount: cwAmount,
        })

      const [newState, _] = KillCharacterFromWoundPerhaps({
        state: gameState!,
        characterID: characterName as CharacterNames,
        isDayChange,
      })

      expect(
        newState?.charactersDead.has(characterName as CharacterNames),
      ).toBe(expectedDead)
      expect(newState?.characters.has(characterName as CharacterNames)).toBe(
        !expectedDead,
      )
    },
  )

  it('should return state normally if character does not have critical wound modifier', () => {
    const [newState, _] = KillCharacterFromWoundPerhaps({
      state: gameState!,
      characterID: 'Ysara Mercer',
      isDayChange: false,
    })

    expect(newState?.charactersDead.has('Ysara Mercer')).toBeFalse()
  })
})
