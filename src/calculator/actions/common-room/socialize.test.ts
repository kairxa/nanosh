import { INVALID_NOT_ENOUGH_AP } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import socialize from './socialize'

describe('actions.common-area.socialize', () => {
  const [gameState, _] = GetInitialGame('socialize-test', 12345)
  gameState!.characters.get('Alisa Huang')!.ap = 7
  gameState!.characters.get('Rina Mikami')!.ap = 7
  gameState!.characters
    .get('Rina Mikami')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })
  gameState!.morale = 1

  it('should socialize normally, not silver', () => {
    const [newState, error] = socialize({
      state: gameState!,
      invokeTime: 1234,
      characterID: 'Alisa Huang',
    })

    expect(error).toBeNull()

    const newAlisa = newState?.characters.get('Alisa Huang')
    expect(newAlisa?.ap).toBe(6)
    expect(newAlisa?.cycleActions.get(1234)).toBe(
      'action.common-area.socialize',
    )
    expect(newAlisa?.modifiers.get('character.cycle.deprived')?.amount).toBe(0)

    expect(newState?.morale).toBe(2)
  })

  it('should socialize with silver bonuses', () => {
    const [newState, error] = socialize({
      state: gameState!,
      invokeTime: 1234,
      characterID: 'Rina Mikami',
    })

    expect(error).toBeNull()

    const newRina = newState?.characters.get('Rina Mikami')
    expect(newRina?.ap).toBe(7)
    expect(newRina?.cycleActions.get(1234)).toBe('action.common-area.socialize')
    expect(newRina?.modifiers.get('character.cycle.deprived')?.amount).toBe(3)

    expect(newState?.morale).toBe(3)
  })

  it('should socialize, dirty penalty', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState?.characters
      .get('Rina Mikami')
      ?.modifiers.set('character.cycle.dirty', {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      })
    ;[newState, error] = socialize({
      state: newState!,
      invokeTime: 1234,
      characterID: 'Rina Mikami',
    })

    expect(error).toBeNull()

    const newRina = newState?.characters.get('Rina Mikami')
    expect(newRina?.ap).toBe(7)
    expect(newRina?.cycleActions.get(1234)).toBe('action.common-area.socialize')
    expect(newRina?.modifiers.get('character.cycle.deprived')?.amount).toBe(3)

    expect(newState?.morale).toBe(2)
  })

  it('should invalidate request, not enough AP', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.characters.get('Alisa Huang')!.ap = 0
    ;[newState, error] = socialize({
      state: newState!,
      invokeTime: 1234,
      characterID: 'Alisa Huang',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
