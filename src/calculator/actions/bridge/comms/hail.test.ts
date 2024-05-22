import { type TraderShow, type TraderShowItem } from '@nanosh/types/trader'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import hailAccept, { hailCalculate } from './hail'

describe('action.bridge.comms.hail', () => {
  const [gameState, _] = GetInitialGame('hail-test', 123)
  gameState!.day = 10
  gameState!.characters.get('Alisa Huang')!.ap = 7
  gameState!.shipLocation = 'South American Alliance'

  it('should calculate what will be hailed today', () => {
    const [traderResult, error] = hailCalculate({
      state: gameState!,
      gameID: 'hail-test',
    })
    const engineeredResult: TraderShow = {
      name: 'Amazonian Warmaidens',
      given: {
        amount: 24,
        resource: 'rations',
      },
      taken: {
        amount: 3,
        resource: 'eCells',
      },
      items: new Set<TraderShowItem>([{ given: 5, itemName: 'food.glownana' }]),
    }
    expect(error).toBeNull()
    expect(traderResult).toMatchObject(engineeredResult)
  })

  it('should hail properly', () => {
    const [newState, error] = hailAccept({
      state: gameState!,
      gameID: 'hail-test',
      invokeTime: 123,
      characterID: 'Alisa Huang',
    })
    expect(error).toBeNull()
    expect(newState?.ship.eCells).toBe(gameState!.ship.eCells - 3)
    expect(newState?.ship.rations).toBe(gameState!.ship.rations + 24)
    expect(newState?.ship.cargo.size).toBe(5)
  })
})
