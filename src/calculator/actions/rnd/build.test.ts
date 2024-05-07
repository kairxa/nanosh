import {
  INVALID_BUILD_ITEM_NAME_NOT_CRAFTABLE,
  INVALID_BUILD_NOT_ENOUGH_RESOURCES,
  INVALID_INVENTORY_FULL,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import rndbuild from './build'

describe('action.rnd.build', () => {
  const [gameState, _] = GetInitialGame('rnd-build-test', 1234)
  gameState!.craftable.add('weapon.heavy.arcus-driver')
  gameState!.characters.get('Val')!.ap = 7
  gameState!.characters.get('Val')!.modifiers.set('character.cycle.deprived', {
    start: { day: 1, cycle: 1 },
    expiry: { day: -1, cycle: -1 },
    amount: 7,
  })
  gameState!.characters.get('Momo Tzigane')!.ap = 7
  gameState!.characters
    .get('Momo Tzigane')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })

  it('should build with reduced amount', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = rndbuild({
      state: gameState!,
      gameID: 'rnd-build-test',
      invokeTime: 1234,
      characterID: 'Val',
      itemName: 'weapon.heavy.arcus-driver',
    })

    expect(error).toBeNull()
    const val = newState?.characters.get('Val')
    expect(val?.ap).toBe(6)
    expect(val?.modifiers.get('character.cycle.deprived')?.amount).toBe(5)
    expect(val?.cycleActions.get(1234)).toBe('action.rnd.build')
    expect(val?.modifiers.has('character.cycle.dirty')).toBeTrue()
    expect(gameState?.characters.get('Val')?.inventory.size).toBe(0)
    expect(val?.inventory.size).toBe(1)

    expect(newState?.ship.eCells).toBe(gameState!.ship.eCells - 3) // 5 - Math.ceil(5 * 0.3) = 5 - 2 = 3
    expect(newState?.ship.supplies).toBe(gameState!.ship.supplies - 49) // 70 - Math.ceil(70 * 0.3) = 70 - 21 = 49
  })

  it('should build with normal amount', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = rndbuild({
      state: gameState!,
      gameID: 'rnd-build-test-no-dirty-please',
      invokeTime: 1234,
      characterID: 'Momo Tzigane',
      itemName: 'weapon.heavy.arcus-driver',
    })

    expect(error).toBeNull()
    const momo = newState?.characters.get('Momo Tzigane')
    expect(momo?.ap).toBe(5)
    expect(momo?.modifiers.get('character.cycle.deprived')?.amount).toBe(7)
    expect(momo?.cycleActions.get(1234)).toBe('action.rnd.build')
    expect(momo?.modifiers.has('character.cycle.dirty')).toBeFalse()

    expect(newState?.ship.eCells).toBe(gameState!.ship.eCells - 5)
    expect(newState?.ship.supplies).toBe(gameState!.ship.supplies - 70)
  })

  it('should invalidate request because inventory is full', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState?.characters.get('Momo Tzigane')?.inventory.add({
      id: 'freeid01',
      itemName: 'item.grenade',
      broken: false,
    })
    newState?.characters.get('Momo Tzigane')?.inventory.add({
      id: 'freeid02',
      itemName: 'item.grenade',
      broken: false,
    })
    newState?.characters.get('Momo Tzigane')?.inventory.add({
      id: 'freeid03',
      itemName: 'item.grenade',
      broken: false,
    })
    ;[newState, error] = rndbuild({
      state: newState!,
      gameID: 'rnd-build-test',
      invokeTime: 1234,
      characterID: 'Momo Tzigane',
      itemName: 'weapon.heavy.arcus-driver',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_INVENTORY_FULL)
  })

  it('should invalidate request because item is not inside craftable', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = rndbuild({
      state: gameState!,
      gameID: 'rnd-build-test',
      invokeTime: 1234,
      characterID: 'Momo Tzigane',
      itemName: 'weapon.guns.pugio',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_BUILD_ITEM_NAME_NOT_CRAFTABLE)
  })

  it('should invalidate request because not enough resources', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState!.ship.supplies = 69 //
    ;[newState, error] = rndbuild({
      state: newState!,
      gameID: 'rnd-build-test',
      invokeTime: 1234,
      characterID: 'Momo Tzigane',
      itemName: 'weapon.heavy.arcus-driver',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_BUILD_NOT_ENOUGH_RESOURCES)
  })
})
