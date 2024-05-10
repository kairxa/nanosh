import {
  INVALID_FIRSTAID_TARGET_NOT_IN_MEDLAB,
  INVALID_FIRSTAID_TARGET_NOT_WOUNDED,
  INVALID_NOT_ENOUGH_SUPPLIES,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import firstaid from './firstaid'

describe('action.medlab.firstaid', () => {
  const [gameState, _] = GetInitialGame('firstaid-test', 12345)
  gameState!.characters.get('Niral Pierce')!.ap = 7
  gameState!.characters.get('Niral Pierce')!.location = 'medlab'
  gameState!.characters
    .get('Niral Pierce')!
    .modifiers.set('character.wound.light', {
      start: { day: 1, cycle: 1 },
      expiry: { day: 1, cycle: 4 },
      amount: 2,
    })
  gameState!.characters.get('Alisa Huang')!.ap = 7
  gameState!.characters.get('Alisa Huang')!.location = 'medlab'
  gameState!.characters
    .get('Alisa Huang')!
    .modifiers.set('character.wound.light', {
      start: { day: 1, cycle: 1 },
      expiry: { day: 1, cycle: 4 },
      amount: 2,
    })

  it("should reduce Alisa's light wound by two", () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = firstaid({
      state: gameState!,
      invokeTime: 123,
      targetID: 'Alisa Huang',
      characterID: 'Niral Pierce',
    })

    expect(error).toBeNull()

    const newAlisa = newState?.characters.get('Alisa Huang')
    const newNiral = newState?.characters.get('Niral Pierce')

    expect(newAlisa?.modifiers.get('character.wound.light')?.amount).toBe(0)
    expect(
      newAlisa?.modifiers.get('character.wound.stabilized.light')?.amount,
    ).toBe(2)

    expect(newNiral?.modifiers.get('character.wound.light')?.amount).toBe(2)
    expect(
      newNiral?.modifiers.get('character.wound.stabilized.light')?.amount,
    ).toBeFalsy()
    expect(newNiral?.cycleActions.get(123)).toBe('action.medlab.firstaid')
    expect(newNiral?.ap).toBe(6)

    expect(newState?.ship.supplies).toBe(gameState!.ship.supplies - 2)
  })

  it("should reduce Niral's light wound by one", () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = firstaid({
      state: gameState!,
      invokeTime: 123,
      targetID: 'Niral Pierce',
      characterID: 'Alisa Huang',
    })

    expect(error).toBeNull()

    const newAlisa = newState?.characters.get('Alisa Huang')
    const newNiral = newState?.characters.get('Niral Pierce')

    expect(newAlisa?.modifiers.get('character.wound.light')?.amount).toBe(2)
    expect(
      newAlisa?.modifiers.get('character.wound.stabilized.light')?.amount,
    ).toBeFalsy()
    expect(newAlisa?.cycleActions.get(123)).toBe('action.medlab.firstaid')
    expect(newAlisa?.ap).toBe(5)

    expect(newNiral?.modifiers.get('character.wound.light')?.amount).toBe(1)
    expect(
      newNiral?.modifiers.get('character.wound.stabilized.light')?.amount,
    ).toBe(1)
  })

  it('should invalidate request due to not enough supplies', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState!.ship.supplies = 1
    ;[newState, error] = firstaid({
      state: newState!,
      invokeTime: 123,
      targetID: 'Niral Pierce',
      characterID: 'Alisa Huang',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_SUPPLIES)
  })

  it('should only reduce one existing LW despite having physician', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState!.characters
      .get('Niral Pierce')
      ?.modifiers.set('character.wound.light', {
        start: { day: 1, cycle: 1 },
        expiry: { day: 1, cycle: 4 },
        amount: 1,
      })
    ;[newState, error] = firstaid({
      state: newState!,
      invokeTime: 123,
      targetID: 'Niral Pierce',
      characterID: 'Niral Pierce',
    })

    expect(error).toBeNull()

    const newNiral = newState?.characters.get('Niral Pierce')
    expect(newNiral?.modifiers.get('character.wound.light')?.amount).toBe(0)
    expect(
      newNiral?.modifiers.get('character.wound.stabilized.light')?.amount,
    ).toBe(1)
    expect(newNiral?.cycleActions.get(123)).toBe('action.medlab.firstaid')
    expect(newNiral?.ap).toBe(6)
  })

  it('should invalidate request because one of the characters are not in medlab', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState!.characters.get('Niral Pierce')!.location = 'bridge'
    ;[newState, error] = firstaid({
      state: newState!,
      invokeTime: 123,
      targetID: 'Niral Pierce',
      characterID: 'Niral Pierce',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_FIRSTAID_TARGET_NOT_IN_MEDLAB)
  })

  it('should invalidate request because character is not wounded', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState!.characters
      .get('Niral Pierce')!
      .modifiers.delete('character.wound.light')
    ;[newState, error] = firstaid({
      state: newState!,
      invokeTime: 123,
      targetID: 'Niral Pierce',
      characterID: 'Niral Pierce',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_FIRSTAID_TARGET_NOT_WOUNDED)
  })
})
