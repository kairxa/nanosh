import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import broken from './broken'

describe('ship.unique.barracks.broken', () => {
  const [gameState, _] = GetInitialGame('barracks-broken', 12345)

  it('should reduce praetorians by a certain percentage amount', () => {
    const [newState, error] = broken({
      state: gameState!,
      invokeTime: 12345,
      gameID: 'barracks-broken',
    })

    expect(error).toBeNull()
    expect(newState?.ship.praetorians).toBe(2)
  })

  it('should reduce praetorians by no more than 1', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.praetorians = 1
    ;[newState, error] = broken({
      state: newState!,
      invokeTime: 12345,
      gameID: 'barracks-broken',
    })

    expect(error).toBeNull()
    expect(newState?.ship.praetorians).toBe(0)
  })
})
