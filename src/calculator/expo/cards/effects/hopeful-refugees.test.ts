import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import HopefulRefugees from './hopeful-refugees'

describe('HopefulRefugees', () => {
  const [gameState, _] = GetInitialGame('hopeful-refugees-test', 12345)

  it('should add civitates', () => {
    const [newState, error] = HopefulRefugees({
      state: gameState!,
      gameID: 'hopeful-refugees-test',
      invokeTime: 123456,
    })

    expect(error).toBeNull()
    expect(newState?.ship.civitates).toBe(14)
  })
})
