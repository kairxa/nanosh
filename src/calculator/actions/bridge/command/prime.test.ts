import { INVALID_NOT_ENOUGH_AP } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import prime from './prime'

describe('action.bridge.command.prime', () => {
  const [gameState, _] = GetInitialGame('initial-state-game-test', 1715619600000)
  const solasMercer = gameState!.characters.get('Solas Mercer')
  solasMercer!.ap = 7
  it('should add cannon-primed modifier and reduce character ap', () => {
    expect(
      gameState!.ship.modifiers.has('ship.combat.bridge.command.cannon-primed'),
    ).toBeFalse()
    const [newState, _] = prime({
      characterID: 'Solas Mercer',
      start: {
        cycle: 1,
        day: 1,
      },
      state: gameState!,
      invokeTime: 123,
    }) as [Game, null]

    expect(
      newState.ship.modifiers.has('ship.combat.bridge.command.cannon-primed'),
    )
    expect(newState!.characters.get('Solas Mercer')!.ap).toBe(6)
    expect(
      newState!.characters.get('Solas Mercer')!.cycleActions.get(123),
    ).toBe('action.bridge.command.prime')
  })

  it('should invalidate request due to not enough AP', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState?.characters.set('Solas Mercer', { ...solasMercer!, ap: 0 })
    ;[newState, error] = prime({
      characterID: 'Solas Mercer',
      start: {
        cycle: 1,
        day: 1,
      },
      state: newState!,
      invokeTime: 123,
    })
    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
