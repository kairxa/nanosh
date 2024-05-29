import { INVALID_NOT_ENOUGH_AP } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import calibrate from './calibrate'

describe('action.fightercrafts-room.calibrate', () => {
  const [gameState, _] = GetInitialGame('calibrate-test', 12345)
  gameState!.day = 1
  gameState!.cycle = 1
  gameState!.characters.get('Soren Koda')!.ap = 7
  gameState!.characters
    .get('Soren Koda')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })
  gameState!.characters.get('Ysara Mercer')!.ap = 7
  gameState!.characters
    .get('Ysara Mercer')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })

  it('should optimize fightercrafts', () => {
    const [newState, error] = calibrate({
      state: gameState!,
      gameID: 'calibrate-test',
      invokeTime: 12345,
      characterID: 'Soren Koda',
    })

    expect(error).toBeNull()
    expect(
      newState?.ship.modifiers.get('ship.persistent.buzzard.optimized'),
    ).toMatchObject({
      start: { day: 1, cycle: 1 },
      expiry: { day: 2, cycle: 4 },
      amount: 1,
    })
    expect(newState?.characters.get('Soren Koda')?.ap).toBe(6)
    expect(
      newState?.characters
        .get('Soren Koda')
        ?.modifiers.has('character.cycle.dirty'),
    ).toBeTrue()
    expect(
      newState?.characters.get('Soren Koda')?.cycleActions.get(12345),
    ).toBe('action.fightercrafts-bay.calibrate')
    expect(
      newState?.characters
        .get('Soren Koda')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(6)
  })

  it('should optimize fightercrafts with another character non dutiful and non diligent', () => {
    const [newState, error] = calibrate({
      state: gameState!,
      gameID: 'calibrate-test',
      invokeTime: 123,
      characterID: 'Ysara Mercer',
    })

    expect(error).toBeNull()
    expect(
      newState?.ship.modifiers.get('ship.persistent.buzzard.optimized'),
    ).toMatchObject({
      start: { day: 1, cycle: 1 },
      expiry: { day: 2, cycle: 4 },
      amount: 1,
    })
    expect(newState?.characters.get('Ysara Mercer')?.ap).toBe(5)
    expect(
      newState?.characters
        .get('Ysara Mercer')
        ?.modifiers.has('character.cycle.dirty'),
    ).toBeFalse()
    expect(
      newState?.characters.get('Ysara Mercer')?.cycleActions.get(123),
    ).toBe('action.fightercrafts-bay.calibrate')
    expect(
      newState?.characters
        .get('Ysara Mercer')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(7)
  })

  it('should invalidate request due to not enough AP', () => {
    let newState: Game | null
    let error: Error | null = null
    newState = structuredClone(gameState)
    newState!.characters.get('Soren Koda')!.ap = 0
    ;[newState, error] = calibrate({
      state: newState!,
      invokeTime: 1234,
      characterID: 'Soren Koda',
      gameID: 'calibrate-test',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
