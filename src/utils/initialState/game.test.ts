import { beforeAll, describe, expect, it, mock, setSystemTime } from 'bun:test'
import { GetInitialGame } from './game'

// Wow this mock covers all other tests. BE CAREFUL. WOW.
mock.module('uuidv7', () => ({
  uuidv7: () => 'initial-state-game-test',
}))

describe('Create initial game', () => {
  // THAT WARNING ALSO APPLIES TO THIS. WOW.
  beforeAll(() => {
    setSystemTime(new Date(2024, 4, 14))
  })

  it('should generate initial game', () => {
    const [game, error] = GetInitialGame()
    expect(error).toBeNull()

    expect(game?.shipLocation).toBe('SEA Bloc')
    expect(game?.nanosh.mainBase).not.toBe(game?.shipLocation) // 10% chance to get shipLocation.
    expect(game?.nanosh.auxBase).not.toBe(game?.shipLocation)
    expect(game?.nanosh.outposts.size).toBe(3)
  })
})
