import type { CharacterNames } from '@nanosh/types/character'
import { describe, expect, it } from 'bun:test'
import seedrandom from 'seedrandom'
import GetAgileLWBlock from './getAgileLWBlock'
import { GetInitialGame } from './initialState/game'

describe('GetAgileLWBlock', () => {
  const [gameState, _] = GetInitialGame('get-agile-lw-block', 12345)

  it.each([
    ['Brianne "Bree" Cheeseworth', 'get-agile-lw-block-12345', true],
    ['Ysara Mercer', 'get-agile-lw-block-12345', false],
  ])(
    'character: %p, seed: %p, agile triggered: %p',
    (characterName, seed, expectedAgileTriggered) => {
      const character = gameState?.characters.get(
        characterName as CharacterNames,
      )
      const prng = seedrandom(seed)
      const result = GetAgileLWBlock(character!, prng)

      expect(result).toBe(expectedAgileTriggered)
    },
  )
})
