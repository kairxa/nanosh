import {
  INVALID_CYCLE_ACTION_NOT_EMPTY,
  INVALID_SEGGS_TARGET_IS_SELF,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import seggs from './seggs'

describe('action.private-quarters.seggs', () => {
  const [gameState, _] = GetInitialGame('dtt-test', 12345)
  gameState!.characters.get('Tee\'elise "Teal" Qing')!.ap = 7
  gameState!.characters
    .get('Tee\'elise "Teal" Qing')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })
  gameState!.characters.get('Alisa Huang')!.ap = 7
  gameState!.characters
    .get('Alisa Huang')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })

  it('should DTT for both characters', () => {
    const [newState, error] = seggs({
      state: gameState!,
      invokeTime: 1234,
      characterID: 'Tee\'elise "Teal" Qing',
      targetID: 'Alisa Huang',
    })

    expect(error).toBeNull()
    const newTeal = newState?.characters.get('Tee\'elise "Teal" Qing')
    const newAlisa = newState?.characters.get('Alisa Huang')

    expect(newTeal?.modifiers.has('character.cycle.deprived')).toBeFalse()
    expect(newTeal?.modifiers.has('character.day-change.uplifted')).toBeFalse()
    expect(newTeal?.cycleActions.size).toBe(3)
    expect(newTeal?.cycleActions.get(1234)).toBe(
      'action.private-quarters.seggs',
    )
    expect(newTeal?.ap).toBe(6)
    expect(newAlisa?.modifiers.has('character.cycle.deprived')).toBeFalse()
    expect(newAlisa?.modifiers.has('character.day-change.uplifted')).toBeFalse()
    expect(newAlisa?.cycleActions.size).toBe(3)
    expect(newAlisa?.cycleActions.get(1234)).toBe(
      'action.private-quarters.seggs',
    )
    expect(newAlisa?.ap).toBe(6)
  })

  it('should DTT alone', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.projects.done.add('File E120 - Solo Comfort Initiative')
    ;[newState, error] = seggs({
      state: newState!,
      invokeTime: 1234,
      characterID: 'Tee\'elise "Teal" Qing',
      targetID: 'Tee\'elise "Teal" Qing',
    })

    expect(error).toBeNull()
    const newTeal = newState?.characters.get('Tee\'elise "Teal" Qing')
    expect(newTeal?.modifiers.has('character.cycle.deprived')).toBeFalse()
    expect(newTeal?.modifiers.has('character.day-change.uplifted')).toBeFalse()
    expect(newTeal?.cycleActions.size).toBe(3)
    expect(newTeal?.cycleActions.get(1234)).toBe(
      'action.private-quarters.seggs',
    )
    expect(newTeal?.ap).toBe(6)
  })

  it('should remove frustrated and add uplifted', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.projects.done.add('File E120 - Solo Comfort Initiative')
    newState!.characters
      .get('Tee\'elise "Teal" Qing')
      ?.modifiers.set('character.cycle.frustrated', {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      })
    ;[newState, error] = seggs({
      state: newState!,
      invokeTime: 1234,
      characterID: 'Tee\'elise "Teal" Qing',
      targetID: 'Tee\'elise "Teal" Qing',
    })

    expect(error).toBeNull()
    const newTeal = newState?.characters.get('Tee\'elise "Teal" Qing')
    expect(newTeal?.modifiers.has('character.cycle.deprived')).toBeFalse()
    expect(newTeal?.modifiers.has('character.cycle.frustrated')).toBeFalse()
    expect(newTeal?.modifiers.has('character.day-change.uplifted')).toBeTrue()
    expect(newTeal?.cycleActions.size).toBe(3)
    expect(newTeal?.cycleActions.get(1234)).toBe(
      'action.private-quarters.seggs',
    )
    expect(newTeal?.ap).toBe(6)
  })

  it('should invalidate action, because of alone', () => {
    const [newState, error] = seggs({
      state: gameState!,
      invokeTime: 1234,
      characterID: 'Tee\'elise "Teal" Qing',
      targetID: 'Tee\'elise "Teal" Qing',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_SEGGS_TARGET_IS_SELF)
  })

  it('should invalidate action, because of not the only action this cycle, character', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState?.characters
      .get('Tee\'elise "Teal" Qing')
      ?.cycleActions.set(123, 'action.medlab.surgery')
    ;[newState, error] = seggs({
      state: newState!,
      invokeTime: 1234,
      characterID: 'Tee\'elise "Teal" Qing',
      targetID: 'Alisa Huang',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_CYCLE_ACTION_NOT_EMPTY)
  })

  it('should remove frustrated and add uplifted - different character', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.characters
      .get('Tee\'elise "Teal" Qing')
      ?.modifiers.set('character.cycle.frustrated', {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      })
    ;[newState, error] = seggs({
      state: newState!,
      invokeTime: 1234,
      characterID: 'Alisa Huang',
      targetID: 'Tee\'elise "Teal" Qing',
    })

    expect(error).toBeNull()
    const newTeal = newState?.characters.get('Tee\'elise "Teal" Qing')
    expect(newTeal?.modifiers.has('character.cycle.deprived')).toBeFalse()
    expect(newTeal?.modifiers.has('character.cycle.frustrated')).toBeFalse()
    expect(newTeal?.modifiers.has('character.day-change.uplifted')).toBeTrue()
    expect(newTeal?.cycleActions.size).toBe(3)
    expect(newTeal?.cycleActions.get(1234)).toBe(
      'action.private-quarters.seggs',
    )
    expect(newTeal?.ap).toBe(6)
  })

  it('should invalidate action, because of not the only action this cycle, target', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState?.characters
      .get('Alisa Huang')
      ?.cycleActions.set(123, 'action.medlab.surgery')
    ;[newState, error] = seggs({
      state: newState!,
      invokeTime: 1234,
      characterID: 'Tee\'elise "Teal" Qing',
      targetID: 'Alisa Huang',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_CYCLE_ACTION_NOT_EMPTY)
  })
})
