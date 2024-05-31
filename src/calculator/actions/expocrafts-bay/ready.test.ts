import { INVALID_MAX_EXPO_MEMBERS_REACHED } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import ready from './ready'

describe('action.expocrafts-bay.ready', () => {
  const [gameState, _] = GetInitialGame('expo-ready-test', 12345)
  gameState!.characters.get('Ysara Mercer')!.ap = 7

  it('should add Ysara to expo members', () => {
    const [newState, error] = ready({
      state: gameState!,
      characterID: 'Ysara Mercer',
    })

    expect(error).toBeNull()
    expect(newState?.ship.expo.members.has('Ysara Mercer')).toBeTrue()
    expect(newState?.characters.get('Ysara Mercer')?.ap).toBe(6)
  })

  it('should invalidate request due to max expo members', () => {
    let newState: Game | null = structuredClone(gameState)
    let error: Error | null = null
    newState?.ship.expo.members.add('Val')
    newState?.ship.expo.members.add('Alisa Huang')
    newState?.ship.expo.members.add('Soren Koda')
    newState?.ship.expo.members.add('Tee\'elise "Teal" Qing')
    ;[newState, error] = ready({
      state: newState!,
      characterID: 'Ysara Mercer',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_MAX_EXPO_MEMBERS_REACHED)
  })
})
