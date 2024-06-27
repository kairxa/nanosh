import { GAME_OVER } from '@nanosh/messages/errors'
import { describe, expect, it } from 'bun:test'
import { GetInitialGame } from '../initialState/game'
import { GameOverNanoshSympathy } from './nanoshSympathy'

describe('GameOverNanoshSympathy', () => {
  const [gameState, _] = GetInitialGame('game-over-nanosh-sympathy', 12345)

  it.each([
    [8, undefined],
    [10, GAME_OVER],
    [15, GAME_OVER],
  ])(
    'with sympathy token: %p, then error message should be %p',
    (sympathyToken, errorMessage) => {
      gameState!.nanoshSympathy = sympathyToken

      const [_, error] = GameOverNanoshSympathy({
        state: gameState!,
      })

      if (!errorMessage) {
        expect(error).toBeNull()
      } else {
        expect(error?.message).toBe(errorMessage as string)
      }
    },
  )
})
