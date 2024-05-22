import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import onair from './onair'

describe('action.bridge.comms.onair', () => {
  const [gameState, _] = GetInitialGame()
  const alisaHuang = gameState?.characters.get('Alisa Huang')
  alisaHuang!.ap = 7
  const sorenKoda = gameState?.characters.get('Soren Koda')
  sorenKoda!.ap = 7
  sorenKoda?.modifiers.set('character.cycle.deprived', {
    start: {
      day: 1,
      cycle: 1,
    },
    expiry: {
      day: -1,
      cycle: -1,
    },
    amount: 4,
  })
  gameState!.day = 2
  gameState!.cycle = 3
  gameState!.morale = 2

  it('should add onair modifier to ship', () => {
    const [newState, error] = onair({
      state: gameState!,
      invokeTime: 123,
      characterID: 'Alisa Huang',
    })

    expect(error).toBeNull()
    expect(newState?.ship.modifiers.has('ship.day-change.bridge.comms.onair'))
    expect(
      newState?.ship.modifiers.get('ship.day-change.bridge.comms.onair'),
    ).toMatchObject({
      start: {
        day: 2,
        cycle: 3,
      },
      expiry: {
        day: 2,
        cycle: 4,
      },
      amount: 1,
    })
    expect(newState?.characters.get('Alisa Huang')?.ap).toBe(6)
    expect(newState?.characters.get('Alisa Huang')?.cycleActions.get(123)).toBe(
      'action.bridge.comms.onair',
    )
  })

  it('should also reduce deprived', () => {
    const [newState, error] = onair({
      state: gameState!,
      invokeTime: 123,
      characterID: 'Soren Koda',
    })

    expect(error).toBeNull()
    expect(newState?.ship.modifiers.has('ship.day-change.bridge.comms.onair'))
    expect(
      newState?.ship.modifiers.get('ship.day-change.bridge.comms.onair'),
    ).toMatchObject({
      start: {
        day: 2,
        cycle: 3,
      },
      expiry: {
        day: 2,
        cycle: 4,
      },
      amount: 1,
    })
    expect(newState?.characters.get('Soren Koda')?.ap).toBe(5)
    expect(newState?.characters.get('Soren Koda')?.cycleActions.get(123)).toBe(
      'action.bridge.comms.onair',
    )
    expect(
      newState?.characters
        .get('Soren Koda')
        ?.modifiers.get('character.cycle.deprived'),
    ).toMatchObject({
      start: {
        day: 1,
        cycle: 1,
      },
      expiry: {
        day: -1,
        cycle: -1,
      },
      amount: 3,
    })
  })
})
