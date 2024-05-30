import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import broken from './broken'

describe('ship.cycle.life-support.broken', () => {
  const [gameState, _] = GetInitialGame('life-support-broken', 12345)

  it('should remove civitates', () => {
    const [newState, error] = broken({
      state: gameState!,
      invokeTime: 12345,
      gameID: 'life-support-broken',
    })

    expect(error).toBeNull()
    expect(newState?.ship.civitates).toBe(9)
  })

  it('should remove praetorians', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.civitates = 0
    ;[newState, error] = broken({
      state: newState!,
      invokeTime: 12345,
      gameID: 'life-support-broken',
    })

    expect(error).toBeNull()
    expect(newState?.ship.praetorians).toBe(4)
  })

  it('should remove a character', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState!.ship.civitates = 0
    newState!.ship.praetorians = 0
    ;[newState, error] = broken({
      state: newState!,
      invokeTime: 12345,
      gameID: 'life-support-broken',
    })

    expect(error).toBeNull()
    expect(newState?.characters.has('Zedius Windsor')).toBeFalse()
    expect(newState?.charactersDead.has('Zedius Windsor')).toBeTrue()
  })
})
