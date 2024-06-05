import {
  INVALID_NOT_ENOUGH_AP,
  INVALID_NOT_ENOUGH_ECELLS,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import shoot from './shoot'

describe('action.laser-turret.shoot', () => {
  const [gameState, _] = GetInitialGame('laser-turret-shoot-test', 12345)
  gameState!.characters.get('Viero Alden')!.ap = 7
  gameState!.ship.eCells = 7
  gameState!.nanosh.aerialUnits = {
    hornets: 10,
    talons: 10,
  }

  it('should calculate shoot', () => {
    const [newState, error] = shoot({
      state: gameState!,
      invokeTime: 12312350124, // keyboard smash
      gameID: 'laser-turret-shoot-test',
      characterID: 'Viero Alden',
    })

    expect(error).toBeNull()
    expect(newState?.ship.eCells).toBe(5)
    expect(newState?.nanosh.aerialUnits).toStrictEqual({
      hornets: 9,
      talons: 10,
    })
    expect(
      newState?.characters.get('Viero Alden')?.cycleActions.get(12312350124),
    ).toBe('action.laser-turret.shoot')
    expect(newState?.characters.get('Viero Alden')?.ap).toBe(6)
  })

  it('should use less eCells', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState?.ship.modifiers.set('ship.persistent.weapon.optimized', {
      start: { day: 1, cycle: 1 },
      expiry: { day: 1, cycle: 4 },
      amount: 1,
    })
    ;[newState, error] = shoot({
      state: newState!,
      invokeTime: 12312350124, // keyboard smash
      gameID: 'laser-turret-shoot-test',
      characterID: 'Viero Alden',
    })

    expect(error).toBeNull()
    expect(newState?.ship.eCells).toBe(6)
  })

  it('should invalidate request - not enough eCells', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.eCells = 1
    ;[newState, error] = shoot({
      state: newState!,
      invokeTime: 12312350124, // keyboard smash
      gameID: 'laser-turret-shoot-test',
      characterID: 'Viero Alden',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_ECELLS)
  })

  it('should invalidate request - not enough ap', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.characters.get('Viero Alden')!.ap = 0
    ;[newState, error] = shoot({
      state: newState!,
      invokeTime: 12312350124, // keyboard smash
      gameID: 'laser-turret-shoot-test',
      characterID: 'Viero Alden',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
