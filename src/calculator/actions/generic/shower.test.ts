import { INVALID_TARGET_LOCATION } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import shower from './shower'

describe('action.generic.shower', () => {
  const [gameState, _] = GetInitialGame('shower-test', 12345)
  gameState!.characters.get('Tee\'elise "Teal" Qing')!.ap = 7
  gameState!.characters.get('Tee\'elise "Teal" Qing')!.location =
    'private-quarters'
  gameState!.characters
    .get('Tee\'elise "Teal" Qing')!
    .modifiers.set('character.cycle.dirty', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 1,
    })
  gameState!.characters
    .get('Tee\'elise "Teal" Qing')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 14,
    })
  gameState!.characters
    .get('Tee\'elise "Teal" Qing')!
    .modifiers.set('character.cycle.frustrated', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 1,
    })

  it('should remove dirty and reduce deprived for Teal', () => {
    const [newState, error] = shower({
      state: gameState!,
      characterID: 'Tee\'elise "Teal" Qing',
      invokeTime: 123,
    })

    expect(error).toBeNull()
    const newTeal = newState!.characters.get('Tee\'elise "Teal" Qing')
    expect(newTeal?.modifiers.get('character.cycle.deprived')?.amount).toBe(
      14 - 3,
    )
    expect(newTeal?.modifiers.get('character.cycle.dirty')).toBeFalsy()
    expect(newTeal?.modifiers.get('character.cycle.frustrated')).toBeFalsy()
    expect(newTeal?.cycleActions.get(123)).toBe('action.generic.shower')
    expect(newTeal?.ap).toBe(6)
  })

  it('should invalidate request because Teal is not in shower rooms', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.characters.get('Tee\'elise "Teal" Qing')!.location = 'garden'
    ;[newState, error] = shower({
      state: newState!,
      characterID: 'Tee\'elise "Teal" Qing',
      invokeTime: 123,
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_TARGET_LOCATION)
  })
})
