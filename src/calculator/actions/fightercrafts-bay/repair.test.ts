import {
  INVALID_FIGHTERCRAFT_NOTBROKEN_NOTFOUND,
  INVALID_NOT_ENOUGH_AP,
  INVALID_NOT_ENOUGH_SUPPLIES,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import repair from './repair'

describe('action.fightercrafts-bay.repair', () => {
  const [gameState, _] = GetInitialGame('repair-test', 12345)
  gameState!.ship.supplies = 100
  gameState!.characters.get('Soren Koda')!.ap = 7
  gameState!.characters
    .get('Soren Koda')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })
  gameState!.characters.get('Val')!.ap = 7
  gameState!.characters.get('Val')!.modifiers.set('character.cycle.deprived', {
    start: { day: 1, cycle: 1 },
    expiry: { day: -1, cycle: -1 },
    amount: 7,
  })
  gameState!.characters.get('Ysara Mercer')!.ap = 7
  gameState!.characters.get('Alisa Huang')!.ap = 0
  gameState!.ship.fighterCrafts.get(1)!.broken = true

  it('should repair broken fightercraft, no ap used (adaptable)', () => {
    const [newState, error] = repair({
      state: gameState!,
      characterID: 'Soren Koda',
      invokeTime: 12345,
      gameID: 'repair-test',
      fightercraftID: 1,
    })

    expect(error).toBeNull()
    expect(newState?.ship.supplies).toBe(60)
    expect(
      newState?.characters
        .get('Soren Koda')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(6)
    expect(
      newState?.characters.get('Soren Koda')?.cycleActions.get(12345),
    ).toBe('action.fightercrafts-bay.repair')
    expect(newState?.characters.get('Soren Koda')?.ap).toBe(7)
    expect(newState?.ship.fighterCrafts.get(1)?.broken).toBeFalse()
  })

  it('should repair broken fightercraft, no ap used (technician)', () => {
    const [newState, error] = repair({
      state: gameState!,
      characterID: 'Val',
      invokeTime: 12345,
      gameID: 'repair-test',
      fightercraftID: 1,
    })

    expect(error).toBeNull()
    expect(newState?.ship.supplies).toBe(60)
    expect(
      newState?.characters
        .get('Soren Koda')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(7)
    expect(newState?.characters.get('Val')?.cycleActions.get(12345)).toBe(
      'action.fightercrafts-bay.repair',
    )
    expect(newState?.characters.get('Val')?.ap).toBe(7)
    expect(
      newState?.characters.get('Val')?.modifiers.has('character.cycle.dirty'),
    ).toBeTrue()
    expect(newState?.ship.fighterCrafts.get(1)?.broken).toBeFalse()
  })

  it('should repair broken fightercraft, normal ap usage', () => {
    const [newState, error] = repair({
      state: gameState!,
      characterID: 'Ysara Mercer',
      invokeTime: 12345,
      gameID: 'repair-test',
      fightercraftID: 1,
    })

    expect(error).toBeNull()
    expect(newState?.ship.supplies).toBe(60)
    expect(
      newState?.characters.get('Ysara Mercer')?.cycleActions.get(12345),
    ).toBe('action.fightercrafts-bay.repair')
    expect(newState?.characters.get('Ysara Mercer')?.ap).toBe(6)
    expect(newState?.ship.fighterCrafts.get(1)?.broken).toBeFalse()
  })

  it('should invalidate request, fightercraftID not broken', () => {
    const [newState, error] = repair({
      state: gameState!,
      characterID: 'Val',
      invokeTime: 12345,
      gameID: 'repair-test',
      fightercraftID: 5,
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_FIGHTERCRAFT_NOTBROKEN_NOTFOUND)
  })

  it('should invalidate request, fightercraftID not found', () => {
    const [newState, error] = repair({
      state: gameState!,
      characterID: 'Val',
      invokeTime: 12345,
      gameID: 'repair-test',
      fightercraftID: 8,
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_FIGHTERCRAFT_NOTBROKEN_NOTFOUND)
  })

  it('should invalidate request, not enough ap', () => {
    const [newState, error] = repair({
      state: gameState!,
      characterID: 'Alisa Huang',
      invokeTime: 12345,
      gameID: 'repair-test',
      fightercraftID: 1,
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })

  it('should invalidate request, not enough supplies', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.supplies = 39
    ;[newState, error] = repair({
      state: newState!,
      characterID: 'Alisa Huang',
      invokeTime: 12345,
      gameID: 'repair-test',
      fightercraftID: 1,
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_SUPPLIES)
  })
})
