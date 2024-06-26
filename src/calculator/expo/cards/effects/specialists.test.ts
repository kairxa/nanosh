import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import Specialists from './specialists'

describe('Specialists', () => {
  const [gameState, _] = GetInitialGame('specialists-test', 12345)

  it('should add civitates', () => {
    const [newState, error] = Specialists({
      state: gameState!,
      gameID: 'specialists-test',
      invokeTime: 123456,
    })

    expect(error).toBeNull()
    expect(newState?.ship.civitates).toBe(12)
  })
})
