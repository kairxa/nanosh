import { INVALID_COMPOUND_MEDS_NAME } from '@nanosh/messages/errors'
import type { ItemNames } from '@nanosh/types/item'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import compound from './compound'

describe('action.medlab.compound', () => {
  const [gameState, _] = GetInitialGame('compound-test', 12345)
  gameState!.characters.get('Niral Pierce')!.ap = 7
  gameState!.characters.get('Alisa Huang')!.ap = 7

  // Using Niral, so supplies are halved.
  it.each([
    ['meds.solacil', 2],
    ['meds.duarin', 4],
    ['meds.trivagex', 6],
    ['meds.vigorisk', 6],
    ['meds.blissbloom', 1],
    ['meds.somnoxa', 1],
    ['meds.lucidix', 4],
  ])('should create %p and reducing %p supplies', (medsName, suppliesUsed) => {
    const [newState, error] = compound({
      state: gameState!,
      invokeTime: 1231,
      medsName: medsName as ItemNames,
      gameID: 'compound-test',
      characterID: 'Niral Pierce',
    })

    expect(error).toBeNull()
    const newNiral = newState?.characters.get('Niral Pierce')
    const newNiralInventory = Array.from(newNiral!.inventory.values())
    expect(
      newNiralInventory.find((item) => item.itemName === medsName),
    ).toBeTruthy()
    expect(newState?.ship.supplies).toBe(
      gameState!.ship.supplies - suppliesUsed,
    )
    expect(gameState?.characters.get('Niral Pierce')?.inventory.size).toBe(0)
    expect(newNiral?.inventory.size).toBe(2)
    expect(newNiral?.ap).toBe(6)
    expect(newNiral?.cycleActions.get(1231)).toBe('action.medlab.compound')
  })

  it('should create meds without any special effects', () => {
    const [newState, error] = compound({
      state: gameState!,
      invokeTime: 1231,
      medsName: 'meds.lucidix',
      gameID: 'compound-test',
      characterID: 'Alisa Huang',
    })

    expect(error).toBeNull()
    expect(gameState?.characters.get('Alisa Huang')?.inventory.size).toBe(0)
    expect(newState?.characters.get('Alisa Huang')?.inventory.size).toBe(1)
    expect(newState?.ship.supplies).toBe(gameState!.ship.supplies - 8)
  })

  it.each([['meds.non-existant']])(
    'should return error not found meds name',
    (medsName) => {
      const [newState, error] = compound({
        state: gameState!,
        invokeTime: 1231,
        medsName: medsName as ItemNames,
        gameID: 'compound-test',
        characterID: 'Alisa Huang',
      })

      expect(newState).toBeNull()
      expect(error?.message).toBe(INVALID_COMPOUND_MEDS_NAME)
    },
  )
})
