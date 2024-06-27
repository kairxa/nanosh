import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import RallyOpen from './rally-in-the-open'

describe('RallyOpen', () => {
  const [gameState, _] = GetInitialGame('rally-open-test', 12345)

  it('should add praetorians', () => {
    const [newState, error] = RallyOpen({
      state: gameState!,
    })

    expect(error).toBeNull()
    expect(newState?.ship.praetorians).toBe(6)
  })
})
