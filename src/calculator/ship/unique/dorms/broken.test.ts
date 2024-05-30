import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import broken from './broken'

describe('ship.unique.dorms.broken', () => {
  const [gameState, _] = GetInitialGame('dorms-broken', 12345)

  it('should reduce civitates by a certain percentage amount', () => {
    const [newState, error] = broken({
      state: gameState!,
      invokeTime: 12345,
      gameID: 'dorms-broken',
    })

    expect(error).toBeNull()
    expect(newState?.ship.civitates).toBe(6)
  })

  it('should reduce civitates by no more than 1', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.civitates = 1
    ;[newState, error] = broken({
      state: newState!,
      invokeTime: 12345,
      gameID: 'dorms-broken',
    })

    expect(error).toBeNull()
    expect(newState?.ship.civitates).toBe(0)
  })
})
