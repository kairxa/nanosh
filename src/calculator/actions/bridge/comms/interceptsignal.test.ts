import { INVALID_NOT_ENOUGH_AP } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import interceptsignal from './interceptsignal'

describe('action.bridge.comms.interceptsignal', () => {
  const [gameState, _] = GetInitialGame()
  const alisaHuang = gameState?.characters.get('Alisa Huang')
  alisaHuang!.ap = 7
  gameState!.intel.basic = 5

  it('should interceptsignal properly', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = interceptsignal({
      invokeTime: 123,
      state: gameState!,
      characterID: 'Alisa Huang',
    })

    expect(error).toBeNull()

    expect(newState?.intel.basic).toBe(6)
    const newAlisaHuang = newState?.characters.get('Alisa Huang')
    expect(newAlisaHuang?.cycleActions.get(123)).toBe(
      'action.bridge.comms.interceptsignal',
    )
    expect(newAlisaHuang?.ap).toBe(6)
  })

  it('should invalidate request due to not enough AP', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState!.characters.get('Alisa Huang')!.ap = 0
    ;[newState, error] = interceptsignal({
      invokeTime: 123,
      state: newState!,
      characterID: 'Alisa Huang',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
