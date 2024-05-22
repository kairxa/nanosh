import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import music from './music'

describe('action.bridge.comms.music', () => {
  const [gameState, _] = GetInitialGame()
  const alisaHuang = gameState?.characters.get('Alisa Huang')
  alisaHuang!.ap = 7
  gameState!.morale = 2

  it('should add crew morale', () => {
    const [newState, error] = music({
      state: gameState!,
      invokeTime: 123,
      characterID: 'Alisa Huang',
    })

    expect(error).toBeNull()
    expect(newState?.characters.get('Alisa Huang')?.ap).toBe(7)
    expect(newState?.characters.get('Alisa Huang')?.cycleActions.get(123)).toBe(
      'action.bridge.comms.music',
    )
    expect(newState?.morale).toBe(4)
  })
})
