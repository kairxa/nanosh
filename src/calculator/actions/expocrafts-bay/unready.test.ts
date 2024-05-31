import { INVALID_EXPO_CHARACTER_IS_NOT_READY } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import unready from './unready'

describe('action.expocrafts-bay.unready', () => {
  const [gameState, _] = GetInitialGame('expo-ready-test', 12345)
  gameState!.characters.get('Ysara Mercer')!.ap = 6
  gameState!.ship.expo.members.add('Val')
  gameState!.ship.expo.members.add('Alisa Huang')
  gameState!.ship.expo.members.add('Soren Koda')
  gameState!.ship.expo.members.add('Ysara Mercer')

  it('should delete Ysara from expo members', () => {
    const [newState, error] = unready({
      state: gameState!,
      characterID: 'Ysara Mercer',
    })

    expect(error).toBeNull()
    expect(newState?.ship.expo.members.has('Ysara Mercer')).toBeFalse()
    expect(newState?.characters.get('Ysara Mercer')?.ap).toBe(7)
  })

  it('should invalidate request due to Ysara not in expo ready list', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState?.ship.expo.members.delete('Ysara Mercer')
    ;[newState, error] = unready({
      state: newState!,
      characterID: 'Ysara Mercer',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_EXPO_CHARACTER_IS_NOT_READY)
  })
})
