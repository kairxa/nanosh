import { describe, expect, it } from 'bun:test'
import { GetInitialGame } from './game'

describe('Create initial game', () => {
  it('should generate initial game', () => {
    const [game, error] = GetInitialGame('initial-state-game-test', 123)
    expect(error).toBeNull()

    expect(game?.shipLocation).toBe('North American Union')
    expect(game?.nanosh.mainBase).not.toBe(game?.shipLocation) // 10% chance to get shipLocation.
    expect(game?.nanosh.auxBase).not.toBe(game?.shipLocation)
    expect(game?.nanosh.outposts.size).toBe(3)
  })
})
