import {
  INVALID_EXPOCRAFT_NOTBROKEN_NOTFOUND,
  INVALID_NOT_ENOUGH_AP,
  INVALID_NOT_ENOUGH_SUPPLIES,
} from '@nanosh/messages/errors'
import type { CharacterNames } from '@nanosh/types/character'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { beforeEach, describe, expect, it } from 'bun:test'
import repair from './repair'

describe('action.expocrafts-bay.repair', () => {
  let gameState: Game | null
  let _: Error | null = null
  ;[gameState, _] = GetInitialGame('expocrafts-bay-repair-test', 12345)
  const baseState = structuredClone(gameState)

  beforeEach(() => {
    gameState = structuredClone(baseState)
  })

  it.each([
    [1234567890, 120, 'Soren Koda', 7, 7, 0, 5, 20, 7, 6, false],
    [1234567899, 120, 'Soren Koda', 7, 7, 0, 5, 20, 7, 6, true],
    [1234567890, 120, 'Alisa Huang', 7, 7, 0, 5, 20, 6, 7, false],
  ])(
    'Repair expocraft, with invokeTime: %p, initialSupplies: %p, characterName: %p, initialAP: %p, initialDeprived: %p, initialExpocraftHealth: %p, maxExpocraftHealth: %p, will result in expectedSupplies: %p, expectedAP: %p, expectedDeprivedAmount: %p, expectedDirty: %p, and make expocraft health to be max health',
    (
      invokeTime,
      initialSupplies,
      characterName,
      initialAP,
      initialDeprived,
      initialExpocraftHealth,
      maxExpocraftHealth,
      expectedSupplies,
      expectedAP,
      expectedDeprivedAmount,
      expectedDirty,
    ) => {
      const character = gameState!.characters.get(
        characterName as CharacterNames,
      )!
      character.ap = initialAP
      character.modifiers.set('character.cycle.deprived', {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: initialDeprived,
      })
      gameState!.ship.supplies = initialSupplies
      gameState!.ship.expoCrafts.get(1)!.health = initialExpocraftHealth
      gameState!.ship.expoCrafts.get(1)!.maxHealth = maxExpocraftHealth

      const [newState, error] = repair({
        state: gameState!,
        characterID: characterName as CharacterNames,
        gameID: 'expocrafts-bay-repair-test',
        invokeTime,
        expocraftID: 1,
      })

      expect(error).toBeNull()
      const newCharacter = newState!.characters.get(
        characterName as CharacterNames,
      )!
      expect(newCharacter.ap).toBe(expectedAP)
      expect(newCharacter.modifiers.has('character.cycle.dirty')).toBe(
        expectedDirty,
      )
      expect(
        newCharacter.modifiers.get('character.cycle.deprived')?.amount,
      ).toBe(expectedDeprivedAmount)
      expect(newState?.ship.supplies).toBe(expectedSupplies)
      expect(newState?.ship.expoCrafts.get(1)?.health).toBe(
        newState!.ship.expoCrafts.get(1)!.maxHealth,
      )
    },
  )

  it.each([
    [
      1234567890,
      120,
      'Soren Koda',
      7,
      7,
      5,
      5,
      INVALID_EXPOCRAFT_NOTBROKEN_NOTFOUND,
    ],
    [1234567899, 20, 'Soren Koda', 7, 7, 0, 5, INVALID_NOT_ENOUGH_SUPPLIES],
    [1234567890, 120, 'Alisa Huang', 0, 7, 0, 5, INVALID_NOT_ENOUGH_AP],
  ])(
    'Repair expocraft, with invokeTime: %p, initialSupplies: %p, characterName: %p, initialAP: %p, initialDeprived: %p, initialExpocraftHealth: %p, maxExpocraftHealth: %p, will return error message: %p',
    (
      invokeTime,
      initialSupplies,
      characterName,
      initialAP,
      initialDeprived,
      initialExpocraftHealth,
      maxExpocraftHealth,
      expectedErrorMessage,
    ) => {
      const character = gameState!.characters.get(
        characterName as CharacterNames,
      )!
      character.ap = initialAP
      character.modifiers.set('character.cycle.deprived', {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: initialDeprived,
      })
      gameState!.ship.supplies = initialSupplies
      gameState!.ship.expoCrafts.get(1)!.health = initialExpocraftHealth
      gameState!.ship.expoCrafts.get(1)!.maxHealth = maxExpocraftHealth

      const [newState, error] = repair({
        state: gameState!,
        characterID: characterName as CharacterNames,
        gameID: 'expocrafts-bay-repair-test',
        invokeTime,
        expocraftID: 1,
      })

      expect(newState).toBeNull()
      expect(error?.message).toBe(expectedErrorMessage)
    },
  )
})
