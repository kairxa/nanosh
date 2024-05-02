import { INVALID_PROJECT_QUEUE_MAX_REACHED } from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { Projects } from '@nanosh/utils/initialState/projects'
import { describe, expect, it } from 'bun:test'
import review from './review'

describe('action.rnd.review', () => {
  const [gameState, _] = GetInitialGame('review-test', 123)
  gameState!.characters.get('Niral Pierce')!.ap = 7

  it('should have matching projects with initialState/projects', () => {
    Projects.forEach((_, projectName) => {
      gameState?.ship.projects.pool.has(projectName)
    })
  })

  it('should review project correctly', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = review({
      state: gameState!,
      invokeTime: 1234,
      gameID: 'review-test',
      characterID: 'Niral Pierce',
    })
    expect(error).toBeNull()
    expect(newState?.ship.projects.queued.size).toBe(1)
    expect(newState?.ship.projects.pool.size).toBe(
      gameState!.ship.projects.pool.size - 1,
    )
    expect(
      newState?.characters.get('Niral Pierce')?.cycleActions.get(1234),
    ).toBe('action.rnd.review')
    expect(newState?.characters.get('Niral Pierce')?.ap).toBe(6)
  })

  it('should invalidate request because queue size is already 3', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState?.ship.projects.queued.set(
      'File 055 - Hoppers Space Optimization',
      { progressCurrent: 0 },
    )
    newState?.ship.projects.queued.set("File 712 - Ysara's Snare", {
      progressCurrent: 0,
    })
    newState?.ship.projects.queued.set(
      'File 711 - Praetorians Suit Force Distribution',
      { progressCurrent: 0 },
    )
    newState?.ship.projects.pool.delete('File 055 - Hoppers Space Optimization')
    newState?.ship.projects.pool.delete("File 712 - Ysara's Snare")
    newState?.ship.projects.pool.delete(
      'File 711 - Praetorians Suit Force Distribution',
    )
    ;[newState, error] = review({
      state: newState!,
      invokeTime: 1234,
      gameID: 'review-test',
      characterID: 'Niral Pierce',
    })

    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_PROJECT_QUEUE_MAX_REACHED)
  })
})
