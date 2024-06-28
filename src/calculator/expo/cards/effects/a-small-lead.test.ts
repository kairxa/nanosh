import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import SmallLead from './a-small-lead'

describe('SmallLead', () => {
  const [gameState, _] = GetInitialGame('small-lead-test', 12345)

  it('should add civitates', () => {
    const [newState, error] = SmallLead({
      state: gameState!,
    })

    expect(error).toBeNull()
    expect(newState?.intel.basic).toBe(1)
  })
})
