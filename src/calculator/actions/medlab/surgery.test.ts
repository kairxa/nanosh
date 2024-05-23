import {
  INVALID_NOT_ENOUGH_AP,
  INVALID_NOT_ENOUGH_SUPPLIES,
  INVALID_SURGERY_TARGET_NOT_WOUNDED,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import surgery from './surgery'

describe('action.medlab.surgery', () => {
  const [gameState, _] = GetInitialGame('surgery-test', 12345)
  gameState!.characters.get('Niral Pierce')!.ap = 7
  gameState!.characters
    .get('Niral Pierce')!
    .modifiers.set('character.wound.critical', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 1,
    })
  gameState!.characters.get('Ysara Mercer')!.ap = 7
  gameState!.characters.get('Ysara Mercer')!.skills.add('skill.surgeon')
  gameState!.characters
    .get('Ysara Mercer')!
    .modifiers.set('character.wound.critical', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 2,
    })
  gameState!.ship.supplies = 10

  it('should treat CW to SCW, two different people, surgeon', () => {
    const [newState, error] = surgery({
      state: gameState!,
      targetID: 'Niral Pierce',
      characterID: 'Ysara Mercer',
      invokeTime: 1234, // 0.29, surgeon === 80% -> prng() > 1-0.8
      gameID: 'surgery-test',
    })

    expect(error).toBeNull()
    expect(
      newState?.characters
        .get('Niral Pierce')
        ?.modifiers.has('character.wound.critical'),
    ).toBeFalse()
    expect(
      newState?.characters
        .get('Niral Pierce')
        ?.modifiers.get('character.cycle.tired')?.amount,
    ).toBe(1)
    expect(
      newState?.characters
        .get('Niral Pierce')
        ?.modifiers.get('character.wound.stabilized.critical')?.amount,
    ).toBe(1)
    expect(
      newState?.characters
        .get('Ysara Mercer')
        ?.modifiers.get('character.cycle.tired')?.amount,
    ).toBe(1)
    expect(newState?.characters.get('Ysara Mercer')?.ap).toBe(5)
    expect(
      newState?.characters.get('Ysara Mercer')?.cycleActions.get(1234),
    ).toBe('action.medlab.surgery')
    expect(newState?.ship.supplies).toBe(1)
  })

  it('should treat CW to SCW, two different people, meticulous', () => {
    const [newState, error] = surgery({
      state: gameState!,
      targetID: 'Ysara Mercer',
      characterID: 'Niral Pierce',
      invokeTime: 123, // 0.06, meticulous === 100% -> prng() > 0
      gameID: 'surgery-test',
    })

    expect(error).toBeNull()
    expect(
      newState?.characters
        .get('Ysara Mercer')
        ?.modifiers.get('character.wound.critical')?.amount,
    ).toBe(1)
    expect(
      newState?.characters
        .get('Ysara Mercer')
        ?.modifiers.get('character.cycle.tired')?.amount,
    ).toBe(1)
    expect(
      newState?.characters
        .get('Ysara Mercer')
        ?.modifiers.get('character.wound.stabilized.critical')?.amount,
    ).toBe(1)
    expect(
      newState?.characters
        .get('Niral Pierce')
        ?.modifiers.get('character.cycle.tired')?.amount,
    ).toBe(1)
    expect(newState?.characters.get('Niral Pierce')?.ap).toBe(5)
    expect(
      newState?.characters.get('Niral Pierce')?.cycleActions.get(123),
    ).toBe('action.medlab.surgery')
  })

  it('should treat CW to SCW, same people', () => {
    const [newState, error] = surgery({
      state: gameState!,
      targetID: 'Ysara Mercer',
      characterID: 'Ysara Mercer',
      invokeTime: 123, // 0.06, meticulous === 100% -> prng() > 0
      gameID: 'surgery-test',
    })

    expect(error).toBeNull()
    expect(newState?.characters.get('Ysara Mercer')?.ap).toBe(3)
  })

  it('should succeed in surgery, project FILE 254', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState?.ship.projects.done.add('File 254 - Operational Surge Paradigm')
    ;[newState, error] = surgery({
      state: newState!,
      targetID: 'Ysara Mercer',
      characterID: 'Niral Pierce',
      invokeTime: 123, // 0.06, surgeon + FILE 254 === 100% -> prng() > 0
      gameID: 'surgery-test',
    })

    expect(error).toBeNull()
  })

  it('should fail surgery, drunk and tired', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState?.characters
      .get('Niral Pierce')
      ?.modifiers.set('character.persistent.drunk', {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 5,
      })
    newState?.characters
      .get('Niral Pierce')
      ?.modifiers.set('character.cycle.tired', {
        start: { day: 1, cycle: 1 },
        expiry: { day: -1, cycle: -1 },
        amount: 5,
      })
    ;[newState, error] = surgery({
      state: newState!,
      targetID: 'Niral Pierce',
      characterID: 'Ysara Mercer',
      invokeTime: 12387, // 0.92, meticulous === 100%, - drunk + tired === 0% -> prng() > 1
      gameID: 'surgery-test',
    })

    expect(error).toBeNull()
    expect(
      newState?.characters
        .get('Ysara Mercer')
        ?.modifiers.get('character.wound.critical')?.amount,
    ).toBe(2)
    expect(
      newState?.characters
        .get('Ysara Mercer')
        ?.modifiers.has('character.wound.stabilized.critical'),
    ).toBeFalse()
  })

  it('should invalidate request, no CW', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState?.characters
      .get('Ysara Mercer')
      ?.modifiers.delete('character.wound.critical')
    ;[newState, error] = surgery({
      state: newState!,
      targetID: 'Ysara Mercer',
      characterID: 'Niral Pierce',
      invokeTime: 12387, // 0.92, meticulous === 100%, - drunk + tired === 0% -> prng() > 1
      gameID: 'surgery-test',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_SURGERY_TARGET_NOT_WOUNDED)
  })

  it('should invalidate request, not enough AP', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.characters.get('Niral Pierce')!.ap = 1
    ;[newState, error] = surgery({
      state: newState!,
      targetID: 'Ysara Mercer',
      characterID: 'Niral Pierce',
      invokeTime: 12387, // 0.92, meticulous === 100%, - drunk + tired === 0% -> prng() > 1
      gameID: 'surgery-test',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })

  it('should invalidate request, not enough supplies', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.supplies = 8
    ;[newState, error] = surgery({
      state: newState!,
      targetID: 'Ysara Mercer',
      characterID: 'Niral Pierce',
      invokeTime: 12387, // 0.92, meticulous === 100%, - drunk + tired === 0% -> prng() > 1
      gameID: 'surgery-test',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_SUPPLIES)
  })
})
