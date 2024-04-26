import {
  INVALID_NOT_ENOUGH_AP,
  INVALID_NOT_ENOUGH_ECELLS,
} from '@nanosh/messages/errors'
import type { Character } from '@nanosh/types/character'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import advance from './advance'

describe('action.bridge.command.advance', () => {
  const [gameState, _] = GetInitialGame() as [Game, null]
  const solasMercer = gameState.characters.get('Solas Mercer') as Character
  solasMercer.playerID = 'my-current-player'
  solasMercer.ap = 3

  let newState: Game | null
  let error: Error | null

  it('should advance normally', () => {
    ;[newState, error] = advance({
      state: gameState,
      characterID: 'Solas Mercer',
      targetSupersectorID: 'European Federation',
      invokeTime: 123,
    })
    expect(error).toBeNull()
    expect(newState?.shipLocation).toBe('European Federation')
    expect(
      newState?.characters.get('Solas Mercer')?.cycleActions.get(123),
    ).toBe('action.bridge.command.advance')
    expect(newState?.ship.eCells).toBe(80) // initial ship location was 2,0, we travel to 0,0. 2 distance.
    expect(newState?.characters.get('Solas Mercer')?.ap).toBe(2)
  })

  it('should not advance because not enough eCells', () => {
    gameState.ship.eCells = 10
    ;[newState, error] = advance({
      state: gameState,
      characterID: 'Solas Mercer',
      targetSupersectorID: 'Oceanian Front',
      invokeTime: 123,
    })
    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_ECELLS)
  })

  it('should not advance because not enough AP', () => {
    solasMercer.ap = 0
    ;[newState, error] = advance({
      state: gameState,
      characterID: 'Solas Mercer',
      targetSupersectorID: 'Oceanian Front',
      invokeTime: 123,
    })
    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
