import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import dutifulDeprivedReduce from './dutiful'

describe('actions.modifiers.traits.dutiful', () => {
  const [gameState, _] = GetInitialGame('dutiful', 12345)
  gameState?.characters
    .get('Soren Koda')
    ?.modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })
  gameState!.characters.get('Soren Koda')!.ap = 7
  gameState?.characters
    .get('Alisa Huang')
    ?.modifiers.set('character.cycle.deprived', {
      start: { day: 1, cycle: 1 },
      expiry: { day: -1, cycle: -1 },
      amount: 7,
    })
  gameState!.characters.get('Alisa Huang')!.ap = 7

  it('should reduce deprived correctly if the character has it', () => {
    const [newState, error] = dutifulDeprivedReduce({
      state: gameState!,
      characterID: 'Soren Koda',
    })

    expect(error).toBeNull()
    expect(
      newState?.characters
        .get('Soren Koda')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(6)
  })

  it('should not reduce deprived if the character does not have it', () => {
    const [newState, error] = dutifulDeprivedReduce({
      state: gameState!,
      characterID: 'Alisa Huang',
    })

    expect(error).toBeNull()
    expect(
      newState?.characters
        .get('Alisa Huang')
        ?.modifiers.get('character.cycle.deprived')?.amount,
    ).toBe(7)
  })
})
