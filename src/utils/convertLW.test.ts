import type { CharacterNames } from '@nanosh/types/character'
import { describe, expect, it } from 'bun:test'
import ConvertLW from './convertLW'
import { GetInitialGame } from './initialState/game'

describe('ConvertLW', () => {
  const [gameState, _] = GetInitialGame('convert-lw-test', 12345)
  gameState?.characters
    .get('Ysara Mercer')
    ?.modifiers.set('character.wound.light', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 2,
    })
  gameState?.characters
    .get('Alisa Huang')
    ?.modifiers.set('character.wound.light', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 3,
    })
  gameState?.characters.get('Val')?.modifiers.set('character.wound.light', {
    start: { day: 1, cycle: 1 },
    expiry: { day: -1, cycle: -1 },
    amount: 4,
  })
  gameState?.characters.get('Val')?.modifiers.set('character.wound.critical', {
    start: { day: 1, cycle: 1 },
    expiry: { day: -1, cycle: -1 },
    amount: 1,
  })
  gameState?.characters
    .get('Niral Pierce')
    ?.modifiers.set('character.wound.light', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 6,
    })

  it.each([
    [2, 0, 'Ysara Mercer'],
    [0, 1, 'Alisa Huang'],
    [1, 2, 'Val'],
    [0, 2, 'Niral Pierce'],
  ])(
    'should calculate %p LW and %p CW if character is %p',
    (expectedLW, expectedCW, characterName) => {
      const [newState, error] = ConvertLW({
        state: gameState!,
        characterID: characterName as CharacterNames,
      })

      expect(error).toBeNull()
      expect(
        newState?.characters
          .get(characterName as CharacterNames)
          ?.modifiers.get('character.wound.light')?.amount,
      ).toBe(expectedLW)
      const cw = newState?.characters
        .get(characterName as CharacterNames)
        ?.modifiers.get('character.wound.critical')
      if (cw) {
        expect(cw?.amount).toBe(expectedCW)
      }
    },
  )
})
