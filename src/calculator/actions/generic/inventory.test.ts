import {
  INVALID_EQUIP_ITEM_UNEQUIPPABLE,
  INVALID_INVENTORY_FULL,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import { equip, unequip } from './inventory'

describe('action.generic.inventory', () => {
  const [gameState, _] = GetInitialGame('inventory-test', 12345)

  it('should unequip and equip normally', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = unequip({
      state: gameState!,
      equipSlot: 'acc-1',
      characterID: 'Val',
    })
    expect(error).toBeNull()
    let val = newState?.characters.get('Val')
    expect(val?.equipment.has('acc-1')).toBeFalse()
    expect(
      Array.from(gameState!.characters.get('Val')!.inventory.values()).find(
        (item) => item.itemName === 'acc.omni-converter',
      ),
    ).toBeFalsy()
    expect(
      Array.from(val!.inventory.values()).find(
        (item) => item.itemName === 'acc.omni-converter',
      ),
    ).toBeTruthy()
    ;[newState, error] = equip({
      state: newState!,
      characterID: 'Val',
      itemName: 'acc.omni-converter',
    })

    expect(error).toBeNull()
    val = newState?.characters.get('Val')
    expect(val?.equipment.has('acc-1')).toBeTrue()
    expect(
      Array.from(val!.inventory.values()).find(
        (item) => item.itemName === 'acc.omni-converter',
      ),
    ).toBeFalsy()
  })

  it('should switch equipped item', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState?.characters.get('Val')?.inventory.add({
      id: 'freeid01',
      itemName: 'weapon.heavy.arcus-driver',
      broken: false,
    })
    ;[newState, error] = equip({
      state: newState!,
      characterID: 'Val',
      itemName: 'weapon.heavy.arcus-driver',
    })
    expect(error).toBeNull()
    const val = newState?.characters.get('Val')
    expect(
      Array.from(val!.inventory.values()).find(
        (item) => item.itemName === 'weapon.unique.vigiles-45',
      ),
    ).toBeTruthy()
    expect(val?.equipment.get('weapon')?.itemName).toBe(
      'weapon.heavy.arcus-driver',
    )
  })

  it('should invalidate unequip due to inventory full', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState?.characters.get('Val')?.inventory.add({
      id: 'freeid01',
      itemName: 'item.grenade',
      broken: false,
    })
    newState?.characters.get('Val')?.inventory.add({
      id: 'freeid02',
      itemName: 'item.grenade',
      broken: false,
    })
    newState?.characters.get('Val')?.inventory.add({
      id: 'freeid03',
      itemName: 'item.grenade',
      broken: false,
    })
    ;[newState, error] = unequip({
      state: newState!,
      equipSlot: 'acc-1',
      characterID: 'Val',
    })
    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_INVENTORY_FULL)
  })

  it('should invalidate equip due to invalid item type', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState?.characters.get('Val')?.inventory.add({
      id: 'freeid01',
      itemName: 'item.grenade',
      broken: false,
    })
    ;[newState, error] = equip({
      state: newState!,
      characterID: 'Val',
      itemName: 'item.grenade',
    })
    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_EQUIP_ITEM_UNEQUIPPABLE)
  })
})
