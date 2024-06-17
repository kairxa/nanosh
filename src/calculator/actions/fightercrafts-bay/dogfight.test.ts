import { INVALID_NOT_ENOUGH_AP } from '@nanosh/messages/errors'
import type { CharacterNames } from '@nanosh/types/character'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { beforeEach, describe, expect, it } from 'bun:test'
import dogfight from './dogfight'

describe('action.fightercrafts-bay.dogfight', () => {
  let gameState: Game | null
  let _: Error | null = null
  ;[gameState, _] = GetInitialGame('dogfight-test', 12345)
  const baseState = structuredClone(gameState)

  beforeEach(() => {
    gameState = structuredClone(baseState)
  })

  it.each([
    [
      12345, // invokeTime
      'Ysara Mercer', // characterName
      undefined, // initialLW
      undefined, // initialCW
      4, // initialHornets
      5, // initialTalons
      false, // initialFile012
      false, // expectedLWExists
      0, // expectedLWAmount
      false, // expectedCWExists
      0, // expectedCWAmount
      0, // expectedHornets
      3, // expectedTalons
      false, // expectedBuzzardBroken
      false, // expectedCharacterDead
      6, // expectedAP
    ],
    [
      123456788, // invokeTime -- diceResult === 2
      'Ysara Mercer', // characterName
      {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      }, // initialLW
      {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      }, // initialCW
      4, // initialHornets
      5, // initialTalons
      false, // initialFile012
      false, // expectedLWExists
      0, // expectedLWAmount
      true, // expectedCWExists
      2, // expectedCWAmount
      4, // expectedHornets
      5, // expectedTalons
      true, // expectedBuzzardBroken
      false, // expectedCharacterDead
      6, // expectedAP
    ],
    [
      1234567895, // invokeTime -- diceResult === 10
      'Ysara Mercer', // characterName
      {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      }, // initialLW
      {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 2,
      }, // initialCW
      4, // initialHornets
      5, // initialTalons
      false, // initialFile012
      false, // expectedLWExists
      0, // expectedLWAmount
      false, // expectedCWExists
      0, // expectedCWAmount
      4, // expectedHornets
      5, // expectedTalons
      true, // expectedBuzzardBroken
      true, // expectedCharacterDead
      0, // expectedAP
    ],
    [
      1234567895, // invokeTime -- diceResult === 10
      'Ysara Mercer', // characterName
      {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      }, // initialLW
      {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 2,
      }, // initialCW
      4, // initialHornets
      5, // initialTalons
      true, // initialFile012
      true, // expectedLWExists
      2, // expectedLWAmount
      true, // expectedCWExists
      2, // expectedCWAmount
      4, // expectedHornets
      5, // expectedTalons
      true, // expectedBuzzardBroken
      false, // expectedCharacterDead -- still alive because of file 012 project
      6, // expectedAP
    ],
    [
      1234567895, // invokeTime -- diceResult === 10
      'Val', // characterName
      {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      }, // initialLW
      {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      }, // initialCW
      4, // initialHornets
      5, // initialTalons
      false, // initialFile012
      true, // expectedLWExists
      1, // expectedLWAmount
      true, // expectedCWExists
      2, // expectedCWAmount
      4, // expectedHornets
      5, // expectedTalons
      true, // expectedBuzzardBroken
      false, // expectedCharacterDead
      5, // expectedAP
    ],
    [
      123456788, // invokeTime -- diceResult === 2
      'Alisa Huang', // characterName
      undefined, // initialLW
      undefined, // initialCW
      4, // initialHornets
      5, // initialTalons
      false, // initialFile012
      true, // expectedLWExists
      2, // expectedLWAmount
      false, // expectedCWExists
      0, // expectedCWAmount
      4, // expectedHornets
      5, // expectedTalons
      true, // expectedBuzzardBroken
      false, // expectedCharacterDead
      5, // expectedAP
    ],
    [
      1234567895, // invokeTime -- diceResult === 10
      'Alisa Huang', // characterName
      undefined, // initialLW
      undefined, // initialCW
      4, // initialHornets
      5, // initialTalons
      false, // initialFile012
      false, // expectedLWExists
      0, // expectedLWAmount
      true, // expectedCWExists
      1, // expectedCWAmount
      4, // expectedHornets
      5, // expectedTalons
      true, // expectedBuzzardBroken
      false, // expectedCharacterDead
      5, // expectedAP
    ],
    [
      123456788, // invokeTime -- diceResult === 2
      'Brianne "Bree" Cheeseworth', // characterName
      {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      }, // initialLW
      {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      }, // initialCW
      4, // initialHornets
      5, // initialTalons
      false, // initialFile012
      true, // expectedLWExists
      1, // expectedLWAmount -- stays because of agile
      true, // expectedCWExists
      1, // expectedCWAmount -- stays because of agile
      4, // expectedHornets
      5, // expectedTalons
      true, // expectedBuzzardBroken
      false, // expectedCharacterDead
      5, // expectedAP
    ],
  ])(
    'dogfight with invokeTime: %p, chara name: %p, lw: %p, cw: %p, hornets: %p, and talons: %p, will result in lw exists: %p, lw amount: %p, cw exists: %p, cw amount: %p, hornets left: %p, talons left: %p, buzzard broken: %p, character dead: %p, and ap: %p',
    (
      invokeTime,
      characterName,
      initialLW,
      initialCW,
      initialHornets,
      initialTalons,
      initialFile012,
      expectedLWExists,
      expectedLWAmount,
      expectedCWExists,
      expectedCWAmount,
      expectedHornets,
      expectedTalons,
      expectedBuzzardBroken,
      expectedCharacterDead,
      expectedAP,
    ) => {
      gameState!.nanosh.aerialUnits.hornets = initialHornets
      gameState!.nanosh.aerialUnits.talons = initialTalons
      if (initialFile012) {
        gameState?.ship.projects.pool.delete(
          'File 012 - M22 "Buzzard" Defensive Retrofit',
        )
        gameState?.ship.projects.done.add(
          'File 012 - M22 "Buzzard" Defensive Retrofit',
        )
      }
      const character = gameState!.characters.get(
        characterName as CharacterNames,
      )!
      character.ap = 7
      if (initialLW) {
        character.modifiers.set('character.wound.light', initialLW)
      }
      if (initialCW) {
        character.modifiers.set('character.wound.critical', initialCW)
      }

      const [newState, error] = dogfight({
        state: gameState!,
        invokeTime,
        fightercraftID: 1,
        characterID: characterName as CharacterNames,
        gameID: 'dogfight-test',
      })

      expect(error).toBeNull()
      expect(newState?.nanosh.aerialUnits.hornets).toBe(expectedHornets)
      expect(newState?.nanosh.aerialUnits.talons).toBe(expectedTalons)
      expect(newState?.ship.fighterCrafts.get(1)?.broken).toBe(
        expectedBuzzardBroken,
      )
      if (!expectedCharacterDead) {
        const newCharacter = newState?.characters.get(
          characterName as CharacterNames,
        )
        expect(newCharacter?.modifiers.has('character.wound.light')).toBe(
          expectedLWExists,
        )
        if (expectedLWExists) {
          expect(
            newCharacter?.modifiers.get('character.wound.light')?.amount,
          ).toBe(expectedLWAmount)
        }
        expect(newCharacter?.modifiers.has('character.wound.critical')).toBe(
          expectedCWExists,
        )
        if (expectedCWExists) {
          expect(
            newCharacter?.modifiers.get('character.wound.critical')?.amount,
          ).toBe(expectedCWAmount)
        }
        expect(newCharacter?.cycleActions.get(invokeTime)).toBe(
          'action.fightercrafts-bay.dogfight',
        )
        expect(newCharacter?.ap).toBe(expectedAP)
      } else {
        expect(
          newState?.charactersDead.has(characterName as CharacterNames),
        ).toBeTrue()
        expect(
          newState?.characters.has(characterName as CharacterNames),
        ).toBeFalse()
      }
    },
  )

  it('should invalidate request, not enough AP', () => {
    gameState!.characters.get('Val')!.ap = 1

    const [newState, error] = dogfight({
      state: gameState!,
      invokeTime: 12345,
      gameID: 'dogfight-test',
      characterID: 'Val',
      fightercraftID: 1,
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
