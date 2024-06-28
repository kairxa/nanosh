import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import ScarceTrail from './scarce-trail'

describe('ScarceTrail', () => {
  const [gameState, _] = GetInitialGame('scarce-trail-test', 12345)

  it('should add intel basic', () => {
    const [newState, error] = ScarceTrail({
      state: gameState!,
      gameID: 'scarce-trail-test',
      invokeTime: 12345,
    })

    expect(error).toBeNull()
    expect(newState?.intel.basic).toBe(1)
  })
})
