import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import SurvivorLegion from './survivor-from-another-legion'

describe('SurvivorLegion', () => {
  const [gameState, _] = GetInitialGame('survivor-legion-test', 12345)

  it('should add praetorians', () => {
    const [newState, error] = SurvivorLegion({
      state: gameState!,
    })

    expect(error).toBeNull()
    expect(newState?.ship.praetorians).toBe(6)
  })
})
