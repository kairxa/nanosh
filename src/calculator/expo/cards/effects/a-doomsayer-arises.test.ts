import { GAME_OVER } from '@nanosh/messages/errors'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import Doomsayer from './a-doomsayer-arises'

describe('GameOverNanoshSympathy', () => {
  const [gameState, _] = GetInitialGame('game-over-nanosh-sympathy', 12345)

  it.each([
    [8, 9, undefined],
    [9, 10, GAME_OVER],
  ])(
    'with sympathy token: %p, then error message should be %p',
    (initialSympathy, expectedSympathy, errorMessage) => {
      gameState!.nanoshSympathy = initialSympathy

      const [newState, error] = Doomsayer({
        state: gameState!,
      })

      if (!errorMessage) {
        expect(newState?.nanoshSympathy).toBe(expectedSympathy)
        expect(error).toBeNull()
      } else {
        expect(newState).toBeNull()
        expect(error?.message).toBe(errorMessage)
      }
    },
  )
})
