import {
  INVALID_NOT_ENOUGH_AP,
  INVALID_NOT_ENOUGH_ECELLS,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import shield from './shield'

describe('action.engine-room.shield', () => {
  const [gameState, _] = GetInitialGame('shield-test', 12345)
  gameState!.characters.get('Alisa Huang')!.ap = 7

  it('should add shield', () => {
    const [newState, error] = shield({
      state: gameState!,
      invokeTime: 12345,
      eCellAmount: 3,
      characterID: 'Alisa Huang',
    })

    expect(error).toBeNull()
    expect(newState?.ship.shield).toBe(30)
    expect(
      newState?.characters.get('Alisa Huang')?.cycleActions.get(12345),
    ).toBe('action.engine-room.shield')
    expect(newState?.characters.get('Alisa Huang')?.ap).toBe(6)
  })

  it('should add shield up to maxShield', () => {
    const [newState, error] = shield({
      state: gameState!,
      invokeTime: 12345,
      eCellAmount: 6,
      characterID: 'Alisa Huang',
    })

    expect(error).toBeNull()
    expect(newState?.ship.shield).toBe(50)
    expect(
      newState?.characters.get('Alisa Huang')?.cycleActions.get(12345),
    ).toBe('action.engine-room.shield')
    expect(newState?.characters.get('Alisa Huang')?.ap).toBe(6)
  })

  it('should invalidate request, not enough ecells', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.eCells = 3
    ;[newState, error] = shield({
      state: newState!,
      invokeTime: 12345,
      eCellAmount: 4,
      characterID: 'Alisa Huang',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_ECELLS)
  })

  it('should invalidate request, not enough ap', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.characters.get('Alisa Huang')!.ap = 0
    ;[newState, error] = shield({
      state: newState!,
      invokeTime: 12345,
      eCellAmount: 4,
      characterID: 'Alisa Huang',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
