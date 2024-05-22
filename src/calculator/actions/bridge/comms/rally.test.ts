import { INVALID_NOT_ENOUGH_AP } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import rally from './rally'

describe('action.bridge.comms.rally', () => {
  const [gameState, _] = GetInitialGame()
  const teal = gameState!.characters.get('Tee\'elise "Teal" Qing')
  teal!.ap = 7
  gameState!.day = 2
  gameState!.cycle = 3

  it('should rally properly', () => {
    const [newState, error] = rally({
      state: gameState!,
      invokeTime: 123,
      characterID: 'Tee\'elise "Teal" Qing',
    })

    expect(error).toBeNull()

    expect(
      newState?.ship.modifiers.has('ship.day-change.general.rallied'),
    ).toBeTrue()
    expect(
      newState?.ship.modifiers.get('ship.day-change.general.rallied'),
    ).toMatchObject({
      start: {
        day: 2,
        cycle: 3,
      },
      expiry: {
        day: 2,
        cycle: 4,
      },
      amount: 1,
    })
    const newTeal = newState?.characters.get('Tee\'elise "Teal" Qing')
    expect(newTeal!.cycleActions.get(123)).toBe('action.bridge.comms.rally')
    expect(newTeal!.ap).toBe(5)
  })

  it('should invalidate request due to not enough AP', () => {
    let newState: Game | null
    let error: Error | null = null
    newState = structuredClone(gameState)
    newState!.characters.get('Tee\'elise "Teal" Qing')!.ap = 0
    ;[newState, error] = rally({
      invokeTime: 123,
      state: newState!,
      characterID: 'Tee\'elise "Teal" Qing',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
