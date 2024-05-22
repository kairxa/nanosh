import {
  INVALID_INVENTORY_ITEM_NOT_FOUND,
  INVALID_REPAIR_ITEM_IS_NOT_BROKEN,
} from '@nanosh/messages/errors'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import repair from './repair'

describe('action.rnd.repair', () => {
  const [gameState, _] = GetInitialGame('repair-test')
  gameState!.characters.get('Alisa Huang')!.ap = 7
  gameState!.characters
    .get('Alisa Huang')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })
  gameState!.characters.get('Alisa Huang')!.inventory.add({
    id: 'alisa-huang-item-01',
    itemName: 'body.heavy.lorica',
    broken: true,
  })
  gameState!.characters.get('Alisa Huang')!.inventory.add({
    id: 'alisa-huang-item-02',
    itemName: 'weapon.heavy.arcus-driver',
    broken: false,
  })
  gameState!.characters.get('Soren Koda')!.ap = 7
  gameState!.characters
    .get('Soren Koda')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })
  gameState!.characters.get('Soren Koda')!.inventory.add({
    id: 'soren-koda-item-01',
    itemName: 'body.heavy.lorica',
    broken: true,
  })

  it('should repair item and reduce deprived', () => {
    const [newState, error] = repair({
      state: gameState!,
      itemID: 'soren-koda-item-01',
      invokeTime: 123,
      characterID: 'Soren Koda',
      gameID: 'repair-test',
    })

    expect(error).toBeNull()
    expect(
      newState?.characters.get('Soren Koda')?.inventory.values().next().value,
    ).toMatchObject({
      id: 'soren-koda-item-01',
      itemName: 'body.heavy.lorica',
      broken: false,
    })
    expect(
      newState?.characters
        .get('Soren Koda')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(6)
    expect(newState?.characters.get('Soren Koda')?.ap).toBe(6)
    expect(newState?.characters.get('Soren Koda')?.cycleActions.get(123)).toBe(
      'action.rnd.repair',
    )
    expect(
      newState?.characters
        .get('Soren Koda')
        ?.modifiers.has('character.cycle.dirty'),
    ).toBeTrue()
  })

  it('should repair item and does not reduce deprived', () => {
    const [newState, error] = repair({
      state: gameState!,
      itemName: 'body.heavy.lorica',
      invokeTime: 12344,
      characterID: 'Alisa Huang',
      gameID: 'repair-test',
    })

    expect(error).toBeNull()
    expect(
      newState?.characters.get('Alisa Huang')?.inventory.values().next().value,
    ).toMatchObject({
      id: 'alisa-huang-item-01',
      itemName: 'body.heavy.lorica',
      broken: false,
    })
    expect(
      newState?.characters
        .get('Alisa Huang')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(7)
    expect(newState?.characters.get('Alisa Huang')?.ap).toBe(5)
    expect(
      newState?.characters.get('Alisa Huang')?.cycleActions.get(12344),
    ).toBe('action.rnd.repair')
    expect(
      newState?.characters
        .get('Alisa Huang')
        ?.modifiers.has('character.cycle.dirty'),
    ).toBeFalse()
  })

  it('should invalidate request due to item not in inventory', () => {
    const [newState, error] = repair({
      state: gameState!,
      itemName: 'acc.voxlink',
      invokeTime: 123,
      characterID: 'Alisa Huang',
      gameID: 'repair-test',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_INVENTORY_ITEM_NOT_FOUND)
  })

  it('should invalidate request because item is not broken', () => {
    const [newState, error] = repair({
      state: gameState!,
      itemName: 'weapon.heavy.arcus-driver',
      invokeTime: 123,
      characterID: 'Alisa Huang',
      gameID: 'repair-test',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_REPAIR_ITEM_IS_NOT_BROKEN)
  })
})
