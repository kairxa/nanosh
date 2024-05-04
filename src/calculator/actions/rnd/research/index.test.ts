import {
  INVALID_CHARACTER_DIRTY,
  INVALID_RESEARCH_QUEUE_ID_MISMATCH,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import {
  CANNON_DEFAULT_MAX_DAMAGE,
  CANNON_DEFAULT_MIN_DAMAGE,
} from '@nanosh/types/generic'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import { researchProgress } from '.'

describe('action.rnd.research', () => {
  const [gameState, _] = GetInitialGame('research-test', 123)
  gameState!.characters.get('Val')!.ap = 7
  gameState!.characters.get('Niral Pierce')!.ap = 7
  gameState!.characters.get('Momo Tzigane')!.ap = 7
  gameState!.ship.projects.pool.delete('File 128 - Finesse Protocol')
  gameState!.ship.projects.queued.set('File 128 - Finesse Protocol', {
    progressCurrent: 0,
  })
  gameState!.ship.projects.pool.delete('File G11 - Apex Bio Enhancement')
  gameState!.ship.projects.queued.set('File G11 - Apex Bio Enhancement', {
    progressCurrent: 0,
  })

  it('should research', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = researchProgress({
      state: gameState!,
      queueID: 1,
      invokeTime: 1234,
      gameID: 'research-test',
      characterID: 'Val',
    })

    expect(error).toBeNull()
    expect(
      newState?.ship.projects.queued.get('File 128 - Finesse Protocol')
        ?.progressCurrent,
    ).toBe(3)
    expect(newState?.characters.get('Val')?.cycleActions.get(1234)).toBe(
      'action.rnd.research',
    )
    expect(newState?.characters.get('Val')?.ap).toBe(5)
  })

  it.each([
    [0, null, INVALID_RESEARCH_QUEUE_ID_MISMATCH],
    [4, null, INVALID_RESEARCH_QUEUE_ID_MISMATCH],
  ])(
    'should invalidate action due to invalid queue ID',
    (queueID, expectNewState, expectErrorMessage) => {
      let newState: Game | null
      let error: Error | null
      ;[newState, error] = researchProgress({
        state: gameState!,
        queueID,
        invokeTime: 1234,
        gameID: 'research-test',
        characterID: 'Val',
      })
      expect(error?.message).toBe(expectErrorMessage)
      expect(newState).toBe(expectNewState)
    },
  )

  it('should invalidate action due to character dirty', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState?.characters.get('Val')?.modifiers.set('character.cycle.dirty', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 1,
    })
    ;[newState, error] = researchProgress({
      state: newState!,
      queueID: 1,
      invokeTime: 1234,
      gameID: 'research-test',
      characterID: 'Val',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_CHARACTER_DIRTY)
  })

  it('should research bio stuffs', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = researchProgress({
      state: gameState!,
      queueID: 2,
      invokeTime: 123455,
      gameID: 'research-test',
      characterID: 'Niral Pierce',
    })

    expect(error).toBeNull()
    expect(
      newState?.ship.projects.queued.get('File G11 - Apex Bio Enhancement')
        ?.progressCurrent,
    ).toBe(4) // 2 from skills, 1 from random savant
  })

  it('should give default progress', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = researchProgress({
      state: gameState!,
      queueID: 2,
      invokeTime: 1234,
      gameID: 'research-test',
      characterID: 'Momo Tzigane',
    })

    expect(error).toBeNull()
    expect(
      newState?.ship.projects.queued.get('File G11 - Apex Bio Enhancement')
        ?.progressCurrent,
    ).toBe(1)
  })

  it('should implement File G11 - Apex Bio Enhancement properly', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState?.ship.projects.queued.set('File G11 - Apex Bio Enhancement', {
      progressCurrent: 11,
    })
    ;[newState, error] = researchProgress({
      state: newState!,
      queueID: 2,
      invokeTime: 1234,
      gameID: 'research-test',
      characterID: 'Momo Tzigane',
    })

    expect(error).toBeNull()
    expect(
      newState?.ship.projects.queued.has('File G11 - Apex Bio Enhancement'),
    ).toBeFalse()
    expect(
      newState?.ship.projects.done.has('File G11 - Apex Bio Enhancement'),
    ).toBeTrue()
    expect(
      newState?.ship.damage.get('action.bridge.command.cannon'),
    ).toMatchObject({
      min: CANNON_DEFAULT_MIN_DAMAGE,
      max: CANNON_DEFAULT_MAX_DAMAGE + 1,
    })
  })

  it('should implement File 128 - Finesse Protocol properly', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState?.ship.projects.queued.clear()
    newState?.ship.projects.queued.set('File 128 - Finesse Protocol', {
      progressCurrent: 13,
    })
    ;[newState, error] = researchProgress({
      state: newState!,
      queueID: 1,
      invokeTime: 1234,
      gameID: 'research-test',
      characterID: 'Momo Tzigane',
    })

    expect(error).toBeNull()
    expect(
      newState?.ship.projects.queued.has('File 128 - Finesse Protocol'),
    ).toBeFalse()
    expect(
      newState?.ship.projects.done.has('File 128 - Finesse Protocol'),
    ).toBeTrue()
    expect(
      newState?.ship.projects.pool.has('File 128 - Finesse Protocol'),
    ).toBeFalse()
    expect(
      newState?.ship.damage.get('action.bridge.command.cannon'),
    ).toMatchObject({
      min: CANNON_DEFAULT_MIN_DAMAGE + 1,
      max: CANNON_DEFAULT_MAX_DAMAGE + 1,
    })
  })

  it('should implement File 129 - Equilibrium Drive properly', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null
    newState?.ship.projects.queued.clear()
    newState?.ship.projects.queued.set('File 129 - Equilibrium Drive', {
      progressCurrent: 16,
    })
    ;[newState, error] = researchProgress({
      state: newState!,
      queueID: 1,
      invokeTime: 1234,
      gameID: 'research-test',
      characterID: 'Momo Tzigane',
    })

    expect(error).toBeNull()
    expect(
      newState?.ship.projects.queued.has('File 129 - Equilibrium Drive'),
    ).toBeFalse()
    expect(
      newState?.ship.projects.done.has('File 129 - Equilibrium Drive'),
    ).toBeTrue()
    expect(
      newState?.ship.projects.pool.has('File 129 - Equilibrium Drive'),
    ).toBeFalse()
    expect(
      newState?.ship.damage.get('action.bridge.command.cannon'),
    ).toMatchObject({
      min: CANNON_DEFAULT_MAX_DAMAGE,
      max: CANNON_DEFAULT_MAX_DAMAGE,
    })
  })
})