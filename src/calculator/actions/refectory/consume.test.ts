import {
  INVALID_NOT_ENOUGH_AP,
  INVALID_NOT_ENOUGH_RATIONS,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import consume from './consume'

describe('action.refectory.consume', () => {
  const [gameState, _] = GetInitialGame('consume-test', 12345)
  gameState!.ship.rations = 77
  gameState!.characters.get('Val')!.ap = 7
  gameState?.characters.get('Val')?.modifiers.set('character.cycle.hungry', {
    start: { day: 1, cycle: 1 },
    expiry: { day: -1, cycle: -1 },
    amount: 1,
  })
  gameState!.characters.get('Alisa Huang')!.ap = 0

  it('should consume properly', () => {
    const [newState, error] = consume({
      state: gameState!,
      invokeTime: 1234,
      characterID: 'Val',
    })

    expect(error).toBeNull()
    expect(newState?.ship.rations).toBe(76)
    expect(
      newState?.characters.get('Val')?.modifiers.has('character.cycle.hungry'),
    ).toBeFalse()
    expect(newState?.characters.get('Val')?.cycleActions.get(1234)).toBe(
      'action.refectory.consume',
    )
    expect(newState?.characters.get('Val')?.ap).toBe(7)
  })

  it('should invalidate action, due to not enough ration', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.rations = 0
    ;[newState, error] = consume({
      state: newState!,
      invokeTime: 1234,
      characterID: 'Val',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_RATIONS)
  })

  it('should invalidate action, due to not enough ap', () => {
    const [newState, error] = consume({
      state: gameState!,
      invokeTime: 1234,
      characterID: 'Alisa Huang',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
