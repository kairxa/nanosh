import {
  INVALID_FIGHTERCRAFT_BROKEN_NOTFOUND,
  INVALID_NOT_ENOUGH_AP,
  INVALID_NOT_ENOUGH_ECELLS,
  INVALID_TARGET_LOCATION,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import patrolrun from './patrolrun'

describe('action.fightercrafts-bay.patrolrun', () => {
  const [gameState, _] = GetInitialGame('patrolrun-test', 12345)
  gameState!.shipLocation = 'SEA Bloc'
  gameState?.subsectors.empty.delete('Jakarta, Indonesia')
  gameState?.nanosh.advances.add('Jakarta, Indonesia')
  gameState!.sectors.get('Jakarta, Indonesia')!.hp = 3
  gameState!.characters.get('Ysara Mercer')!.ap = 7
  gameState!.characters.get('Alisa Huang')!.ap = 7
  gameState!.characters.get('Val')!.ap = 1
  gameState!.ship.fighterCrafts.get(5)!.broken = true
  gameState!.ship.eCells = 7

  it('should do patrolrun normally', () => {
    const [newState, error] = patrolrun({
      state: gameState!,
      invokeTime: 12345,
      subsectorName: 'Jakarta, Indonesia',
      characterID: 'Ysara Mercer',
      fightercraftId: 1,
    })

    expect(error).toBeNull()
    expect(newState?.subsectors.empty.has('Jakarta, Indonesia')).toBeTrue()
    expect(newState?.nanosh.advances.has('Jakarta, Indonesia')).toBeFalse()
    expect(newState?.sectors.get('Jakarta, Indonesia')?.hp).toBe(0)
    expect(newState?.ship.eCells).toBe(5)
    expect(
      newState?.characters.get('Ysara Mercer')?.cycleActions.get(12345),
    ).toBe('action.fightercrafts-bay.patrolrun')
    expect(newState?.characters.get('Ysara Mercer')?.ap).toBe(6)
  })

  it('should do patrolrun normally with non aviator character', () => {
    const [newState, error] = patrolrun({
      state: gameState!,
      invokeTime: 12345,
      subsectorName: 'Jakarta, Indonesia',
      characterID: 'Alisa Huang',
      fightercraftId: 1,
    })

    expect(error).toBeNull()
    expect(newState?.subsectors.empty.has('Jakarta, Indonesia')).toBeTrue()
    expect(newState?.nanosh.advances.has('Jakarta, Indonesia')).toBeFalse()
    expect(newState?.sectors.get('Jakarta, Indonesia')?.hp).toBe(0)
    expect(newState?.ship.eCells).toBe(5)
    expect(
      newState?.characters.get('Alisa Huang')?.cycleActions.get(12345),
    ).toBe('action.fightercrafts-bay.patrolrun')
    expect(newState?.characters.get('Alisa Huang')?.ap).toBe(5)
  })

  it('should invalidate request, invalid subsector target', () => {
    const [newState, error] = patrolrun({
      state: gameState!,
      invokeTime: 12345,
      subsectorName: 'New York City, United States',
      characterID: 'Ysara Mercer',
      fightercraftId: 1,
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_TARGET_LOCATION)
  })

  it('should invalidate request, invalid fightercraftId', () => {
    const [newState, error] = patrolrun({
      state: gameState!,
      invokeTime: 12345,
      subsectorName: 'Jakarta, Indonesia',
      characterID: 'Ysara Mercer',
      fightercraftId: 8,
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_FIGHTERCRAFT_BROKEN_NOTFOUND)
  })

  it('should invalidate request, fightercraftId broken', () => {
    const [newState, error] = patrolrun({
      state: gameState!,
      invokeTime: 12345,
      subsectorName: 'Jakarta, Indonesia',
      characterID: 'Ysara Mercer',
      fightercraftId: 5,
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_FIGHTERCRAFT_BROKEN_NOTFOUND)
  })

  it('should invalidate request, not enough ap', () => {
    const [newState, error] = patrolrun({
      state: gameState!,
      invokeTime: 12345,
      subsectorName: 'Jakarta, Indonesia',
      characterID: 'Val',
      fightercraftId: 1,
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })

  it('should invalidate request, not enough eCells', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.eCells = 1
    ;[newState, error] = patrolrun({
      state: newState!,
      invokeTime: 12345,
      subsectorName: 'Jakarta, Indonesia',
      characterID: 'Ysara Mercer',
      fightercraftId: 1,
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_ECELLS)
  })
})
