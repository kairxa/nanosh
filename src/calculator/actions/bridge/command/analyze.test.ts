import {
  INVALID_ANALYZE_NOT_ENOUGH_BASIC_INTEL,
  INVALID_NOT_ENOUGH_AP,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import analyze from './analyze'

describe('action.bridge.command.analyze', () => {
  const [gameState, _] = GetInitialGame()
  const solasMercer = gameState?.characters.get('Solas Mercer')
  solasMercer!.ap = 7
  gameState!.intel.basic = 8

  it('should analyze properly', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = analyze({
      invokeTime: 123,
      characterID: 'Solas Mercer',
      state: gameState!,
    })

    expect(error).toBe(null)
    expect(newState?.characters.get('Solas Mercer')?.ap).toBe(7)
    expect(newState?.intel.basic).toBe(1)
    expect(newState?.intel.critical).toBe(1)
  })

  it('should invalidate request due to not enough basic intel', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState!.intel.basic = 3
    ;[newState, error] = analyze({
      invokeTime: 123,
      characterID: 'Solas Mercer',
      state: newState!,
    })
    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_ANALYZE_NOT_ENOUGH_BASIC_INTEL)
  })

  it('should invalidate request due to not enough AP', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = analyze({
      invokeTime: 123,
      characterID: 'Tee\'elise "Teal" Qing',
      state: gameState!,
    })
    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
})
