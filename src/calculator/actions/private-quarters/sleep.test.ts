import {
  INVALID_CYCLE_ACTION_NOT_EMPTY,
  INVALID_NOT_ENOUGH_AP,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import sleep from './sleep'

describe('action.private-quarters.sleep', () => {
  const [gameState, _] = GetInitialGame('sleep-test', 12345)
  gameState!.characters
    .get('Momo Tzigane')
    ?.cycleActions.set(1234, 'action.private-quarters.seggs')
  gameState!.characters.get('Momo Tzigane')!.ap = 7
  gameState!.characters
    .get('Ysara Mercer')
    ?.modifiers.set('character.persistent.sick', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 2,
    })
  gameState!.characters
    .get('Ysara Mercer')
    ?.modifiers.set('character.persistent.drunk', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 2,
    })
  gameState!.characters
    .get('Ysara Mercer')
    ?.modifiers.set('character.cycle.tired', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 2,
    })
  gameState!.characters.get('Ysara Mercer')!.ap = 7

  it('should remove sick and drunk each by 1, and tired completely', () => {
    const [newState, error] = sleep({
      state: gameState!,
      gameID: 'sleep-test',
      invokeTime: 121, // 0.81
      characterID: 'Ysara Mercer',
    })

    expect(error).toBeNull()
    const newYsara = newState?.characters.get('Ysara Mercer')
    expect(newYsara?.cycleActions.size).toBe(3)
    expect(newYsara?.modifiers.get('character.persistent.sick')?.amount).toBe(1)
    expect(newYsara?.modifiers.get('character.persistent.drunk')?.amount).toBe(
      1,
    )
    expect(newYsara?.modifiers.has('character.cycle.tired')).toBeFalse()
    expect(newYsara?.ap).toBe(8)
  })

  it('should remove sick and drunk completely because they were 1 each originally', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.characters
      .get('Ysara Mercer')
      ?.modifiers.set('character.persistent.sick', {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      })
    newState!.characters
      .get('Ysara Mercer')
      ?.modifiers.set('character.persistent.drunk', {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      })
    ;[newState, error] = sleep({
      state: newState!,
      characterID: 'Ysara Mercer',
      invokeTime: 121,
      gameID: 'sleep-test',
    })

    expect(error).toBeNull()
    const newYsara = newState?.characters.get('Ysara Mercer')
    expect(newYsara?.cycleActions.size).toBe(3)
    expect(newYsara?.modifiers.has('character.persistent.sick')).toBeFalse()
    expect(newYsara?.modifiers.has('character.persistent.drunk')).toBeFalse()
    expect(newYsara?.modifiers.has('character.cycle.tired')).toBeFalse()
  })

  it('should remove drunk but not sick because of fail RNG', () => {
    const [newState, error] = sleep({
      state: gameState!,
      gameID: 'sleep-test',
      invokeTime: 123,
      characterID: 'Ysara Mercer',
    })

    expect(error).toBeNull()
    const newYsara = newState?.characters.get('Ysara Mercer')
    expect(newYsara?.cycleActions.size).toBe(3)
    expect(newYsara?.modifiers.get('character.persistent.sick')?.amount).toBe(2)
    expect(newYsara?.modifiers.get('character.persistent.drunk')?.amount).toBe(
      1,
    )
  })

  it('should invalidate request due to not the only action this cycle', () => {
    const [newState, error] = sleep({
      state: gameState!,
      gameID: 'sleep-test',
      invokeTime: 1234,
      characterID: 'Momo Tzigane',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_CYCLE_ACTION_NOT_EMPTY)
  })

  it('should invalidate request due to not enough AP', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.characters.get('Ysara Mercer')!.ap = 0
    ;[newState, error] = sleep({
      state: newState!,
      characterID: 'Ysara Mercer',
      invokeTime: 123,
      gameID: 'sleep-test',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
