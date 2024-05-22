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
    const [newState, error] = harvest({
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
    let error: Error | null = null
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
    let error: Error | null = null
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
    let error: Error | null = null
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

  it('should calculate dirtiness', () => {
    let newState: Game | null
    let error: Error | null = null
    newState = structuredClone(gameState)
    newState!.characters.get('Alisa Huang')!.ap = 7
    ;[newState, error] = harvest({
      state: newState!,
      invokeTime: 1234,
      gameID: 'harvest-test-dirty',
      characterID: 'Alisa Huang',
    })
    expect(error).toBeNull()
    expect(
      newState?.characters
        .get('Alisa Huang')
        ?.modifiers.has('character.cycle.dirty'),
    ).toBeTrue()
  })

  it('should reduce deprived if the character has dutiful', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.characters.get('Soren Koda')!.ap = 7
    newState!.characters
      .get('Soren Koda')!
      .modifiers.set('character.cycle.deprived', {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 7,
      })
    ;[newState, error] = harvest({
      state: newState!,
      invokeTime: 1234,
      gameID: 'harvest-test-deprived',
      characterID: 'Soren Koda',
    })

    expect(error).toBeNull()
    expect(
      newState?.characters
        .get('Soren Koda')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(6)
  })
})
