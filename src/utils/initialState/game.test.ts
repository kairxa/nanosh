import { describe, expect, it } from 'bun:test'
import { GetInitialGame } from './game'

describe('Create initial game', () => {
  it('should generate initial game', () => {
    const [game, error] = GetInitialGame(
      'initial-state-game-test',
      1715619600000, // magic number from previous dev env lol. Some tests inside calculator/command needs this number
    )
    expect(error).toBeNull()

    expect(game?.shipLocation).toBe('SEA Bloc')
    expect(game?.nanosh.mainBase).not.toBe(game?.shipLocation) // 10% chance to get shipLocation.
    expect(game?.nanosh.auxBase).not.toBe(game?.shipLocation)
    expect(game?.nanosh.outposts.size).toBe(3)
  })
})
