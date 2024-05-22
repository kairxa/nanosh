import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import propa from './propa'

describe('action.bridge.comms.propa', () => {
  const [gameState, _] = GetInitialGame()
  const alisaHuang = gameState?.characters.get('Alisa Huang')
  alisaHuang!.ap = 7
  gameState!.nanoshSympathy = 5

  it('should reduce nanosh sympathy token', () => {
    const [newState, error] = propa({
      state: gameState!,
      invokeTime: 123,
      characterID: 'Alisa Huang',
    })

    expect(error).toBeNull()
    expect(newState?.characters.get('Alisa Huang')?.ap).toBe(5)
    expect(newState?.characters.get('Alisa Huang')?.cycleActions.get(123)).toBe(
      'action.bridge.comms.propa',
    )
    expect(newState?.nanoshSympathy).toBe(4)
  })
})
