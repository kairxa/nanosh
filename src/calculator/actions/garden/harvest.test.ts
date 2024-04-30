import { INVALID_NOT_ENOUGH_AP } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import harvest from './harvest'

describe('action.garden.harvest', () => {
  const [gameState, _] = GetInitialGame('harvest-test', 1234)
  gameState!.characters.get('X7-Gastronia "Gass" Petalnova')!.ap = 7
  gameState!.ship.rations = 100

  it('should harvest', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = harvest({
      state: gameState!,
      gameID: 'harvest-test',
      invokeTime: 123,
      characterID: 'X7-Gastronia "Gass" Petalnova',
    })

    expect(error).toBeNull()
    expect(newState?.ship.rations).toBe(109)
    expect(newState?.characters.get('X7-Gastronia "Gass" Petalnova')?.ap).toBe(
      6,
    )
    expect(
      newState?.characters
        .get('X7-Gastronia "Gass" Petalnova')
        ?.cycleActions.get(123),
    ).toBe('action.garden.harvest')
  })

  it('should harvest extra due to bountiful modifier', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState?.ship.modifiers.set('ship.persistent.garden.bountiful', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 1,
    })
    ;[newState, error] = harvest({
      state: newState!,
      gameID: 'harvest-test',
      invokeTime: 123,
      characterID: 'X7-Gastronia "Gass" Petalnova',
    })

    expect(error).toBeNull()
    expect(newState?.ship.rations).toBe(113) // Math.floor(9 * 1.5)
    expect(newState?.characters.get('X7-Gastronia "Gass" Petalnova')?.ap).toBe(
      6,
    )
    expect(
      newState?.characters
        .get('X7-Gastronia "Gass" Petalnova')
        ?.cycleActions.get(123),
    ).toBe('action.garden.harvest')
    expect(
      newState?.ship.modifiers.has('ship.persistent.garden.bountiful'),
    ).toBeFalse()
  })

  it('should harvest less due to sapped modifier', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState?.ship.modifiers.set('ship.persistent.garden.sapped', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 1,
    })
    ;[newState, error] = harvest({
      state: newState!,
      gameID: 'harvest-test',
      invokeTime: 123,
      characterID: 'X7-Gastronia "Gass" Petalnova',
    })

    expect(error).toBeNull()
    expect(newState?.ship.rations).toBe(104) // Math.floor(9 * 0.5)
    expect(newState?.characters.get('X7-Gastronia "Gass" Petalnova')?.ap).toBe(
      6,
    )
    expect(
      newState?.characters
        .get('X7-Gastronia "Gass" Petalnova')
        ?.cycleActions.get(123),
    ).toBe('action.garden.harvest')
    expect(
      newState?.ship.modifiers.has('ship.persistent.garden.sapped'),
    ).toBeFalse()
  })

  it('should invalidate request due to not enough AP', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState!.characters.get('X7-Gastronia "Gass" Petalnova')!.ap = 0
    ;[newState, error] = harvest({
      state: newState!,
      gameID: 'harvest-test',
      invokeTime: 123,
      characterID: 'X7-Gastronia "Gass" Petalnova',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
