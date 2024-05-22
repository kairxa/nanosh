import { INVALID_NOT_ENOUGH_AP } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import forage from './forage'

describe('action.bridge.comms.garden', () => {
  const [gameState, _] = GetInitialGame('garden-forage', 1234)
  gameState!.characters.get('X7-Gastronia "Gass" Petalnova')!.ap = 7
  gameState!.day = 4
  gameState!.cycle = 3

  it('should forage', () => {
    const [newState, error] = forage({
      state: gameState!,
      invokeTime: 12345,
      gameID: 'garden-forage',
      characterID: 'X7-Gastronia "Gass" Petalnova',
    })
    expect(error).toBeNull()

    const newGass = newState?.characters.get('X7-Gastronia "Gass" Petalnova')
    expect(newGass?.ap).toBe(6)
    expect(newGass?.cycleActions.get(12345)).toBe('action.garden.forage')

    expect(
      newState?.ship.modifiers.get('ship.day-change.garden.forage'),
    ).toMatchObject({
      amount: 1,
      start: { day: 4, cycle: 3 },
      expiry: { day: 4, cycle: 4 },
    })

    expect(newState?.ship.supplies).toBe(gameState!.ship.supplies + 7)
  })

  it('should invalidate request due to not enough AP', () => {
    const [newState, error] = forage({
      state: gameState!,
      invokeTime: 12345,
      gameID: 'garden-forage',
      characterID: 'Alisa Huang',
    })
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
    expect(newState).toBeNull()
  })

  it('should calculate dirtiness', () => {
    let newState: Game | null
    let error: Error | null = null
    newState = structuredClone(gameState)
    newState!.characters.get('Alisa Huang')!.ap = 7
    ;[newState, error] = forage({
      state: newState!,
      invokeTime: 1234,
      gameID: 'garden-forage',
      characterID: 'Alisa Huang',
    })
    expect(error).toBeNull()
    expect(
      newState?.characters
        .get('Alisa Huang')
        ?.modifiers.has('character.cycle.dirty'),
    ).toBeTrue()
  })
})
