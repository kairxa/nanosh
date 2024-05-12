import { INVALID_CHARACTER_DIRTY } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import provision from './provision'

describe('action.refectory.provision', () => {
  const [gameState, _] = GetInitialGame('provision-test', 12345)
  gameState!.characters.get('Soren Koda')!.ap = 7
  gameState!.characters.get('Alisa Huang')!.ap = 7
  gameState!.characters.get('Ysara Mercer')!.ap = 7
  gameState!.characters
    .get('Soren Koda')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })
  gameState!.characters
    .get('Alisa Huang')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })
  gameState!.characters
    .get('Ysara Mercer')!
    .modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })

  it('should convert supplies to rations with base multiplier', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = provision({
      state: gameState!,
      invokeTime: 123,
      characterID: 'Ysara Mercer',
    })

    expect(error).toBeNull()
    expect(newState?.ship.supplies).toBe(gameState!.ship.supplies - 8)
    expect(newState?.ship.rations).toBe(gameState!.ship.rations + 4)
    expect(
      newState?.characters
        .get('Ysara Mercer')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(7)
    expect(
      newState?.characters.get('Ysara Mercer')?.cycleActions.get(123),
    ).toBe('action.refectory.provision')
    expect(newState?.characters.get('Ysara Mercer')?.ap).toBe(6)
  })

  it('should convert supplies to rations with adaptable multiplier and reduce deprived from dutiful character', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = provision({
      state: gameState!,
      invokeTime: 123,
      characterID: 'Soren Koda',
    })

    expect(error).toBeNull()
    expect(newState?.ship.supplies).toBe(gameState!.ship.supplies - 8)
    expect(newState?.ship.rations).toBe(gameState!.ship.rations + 5)
    expect(
      newState?.characters
        .get('Soren Koda')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(6)
    expect(newState?.characters.get('Soren Koda')?.cycleActions.get(123)).toBe(
      'action.refectory.provision',
    )
    expect(newState?.characters.get('Soren Koda')?.ap).toBe(6)
  })

  it('should convert supplies to rations with cook multiplier', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = provision({
      state: gameState!,
      invokeTime: 123,
      characterID: 'Alisa Huang',
    })

    expect(error).toBeNull()
    expect(newState?.ship.supplies).toBe(gameState!.ship.supplies - 8)
    expect(newState?.ship.rations).toBe(gameState!.ship.rations + 6)
    expect(
      newState?.characters
        .get('Alisa Huang')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(7)
    expect(newState?.characters.get('Alisa Huang')?.cycleActions.get(123)).toBe(
      'action.refectory.provision',
    )
    expect(newState?.characters.get('Alisa Huang')?.ap).toBe(6)
  })

  it('should invalidate request because character is dirty', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState?.characters
      .get('Soren Koda')
      ?.modifiers.set('character.cycle.dirty', {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 1,
      })
    ;[newState, error] = provision({
      state: newState!,
      invokeTime: 123,
      characterID: 'Soren Koda',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_CHARACTER_DIRTY)
  })
})
