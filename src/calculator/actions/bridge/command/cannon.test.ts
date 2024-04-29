import {
  INVALID_SHIP_LOCATION,
  INVALID_TARGET_NOT_NANOSH,
} from '@nanosh/messages/errors'
import type { Character } from '@nanosh/types/character'
import type { Game } from '@nanosh/types/game'
import type { SupersectorNames } from '@nanosh/types/sectors'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import advance from './advance'
import cannon from './cannon'

describe('action.bridge.command.cannon', () => {
  const [gameState, _] = GetInitialGame(
    'initial-state-game-test',
    12345678,
  ) as [Game, null]
  const solasMercer = gameState.characters.get('Solas Mercer') as Character
  solasMercer.ap = 7
  solasMercer.playerID = 'my-current-player'
  gameState.ship.modifiers.set('ship.combat.bridge.command.cannon-primed', {
    start: {
      cycle: 1,
      day: 1,
    },
    expiry: {
      day: -1,
      cycle: -1,
    },
    amount: 1,
  })
  gameState.ship.modifiers.set('ship.persistent.engine.optimized', {
    start: {
      cycle: 1,
      day: 1,
    },
    expiry: {
      cycle: 4,
      day: 2,
    },
    amount: 1,
  })

  it('should fire cannon and damage a target', () => {
    let newState: Game
    let error: null
    newState = structuredClone(gameState)
    newState.shipLocation = 'Antarctic Pole'
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: newState,
      characterID: 'Solas Mercer',
      invokeTime: 120,
      targetID: gameState?.nanosh.mainBase as SupersectorNames,
    }) as [Game, null]

    const newCycleActions =
      newState.characters.get('Solas Mercer')?.cycleActions
    expect(newCycleActions?.get(120)).toBe('action.bridge.command.cannon')
    expect(newState.characters.get('Solas Mercer')?.ap).toBe(7) // still same
    expect(newState.ship.eCells).toBe(120) // still same, cannon-prime
    expect(
      newState.sectors.get(gameState.nanosh.mainBase as SupersectorNames)?.hp,
    ).toBe(44) // random damage, cool
    expect(
      newState.ship.modifiers.has('ship.combat.bridge.command.cannon-primed'),
    ).toBeFalse()
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: newState,
      characterID: 'Solas Mercer',
      invokeTime: 121,
      targetID: gameState?.nanosh.mainBase as SupersectorNames,
    }) as [Game, null]

    expect(newState.characters.get('Solas Mercer')?.ap).toBe(6)
    expect(newState.ship.eCells).toBe(115) // only reduced 5, engine optimized
    expect(
      newState.sectors.get(gameState.nanosh.mainBase as SupersectorNames)?.hp,
    ).toBe(39)
    newState.ship.modifiers.delete('ship.persistent.engine.optimized') // remove engine optimized
    // Emulate destroying main base
    newState.sectors.get(gameState.nanosh.mainBase as SupersectorNames)!.hp = 5
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: newState,
      characterID: 'Solas Mercer',
      invokeTime: 122,
      targetID: gameState?.nanosh.mainBase as SupersectorNames,
    }) as [Game, null]

    expect(newState.ship.eCells).toBe(105) // reduced by 10
    expect(
      newState.sectors.get(gameState.nanosh.mainBase as SupersectorNames)?.hp,
    ).toBe(0)
    expect(newState.nanosh.mainBase).toBeNull()
    expect(newState.characters.get('Solas Mercer')?.cycleActions.size).toBe(3)
  })

  it('should remove aux base', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState.shipLocation = 'RUSSE-CAN'
    newState.sectors.get('RUSSE-CAN')!.hp = 4
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: newState!,
      characterID: 'Solas Mercer',
      invokeTime: 123,
      targetID: 'RUSSE-CAN',
    })

    expect(error).toBeNull()
    expect(newState!.nanosh.auxBase.has('RUSSE-CAN')).toBeFalse()
    expect(newState!.sectors.get('RUSSE-CAN')!.hp).toBe(0)
  })

  it('should remove outpost', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState.shipLocation = 'Oceanian Front'
    newState!.sectors.get('Port Moresby, Papua New Guinea')!.hp = 4
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: newState!,
      characterID: 'Solas Mercer',
      invokeTime: 123,
      targetID: 'Port Moresby, Papua New Guinea',
    })

    expect(error).toBeNull()
    expect(
      newState!.nanosh.outposts.has('Port Moresby, Papua New Guinea'),
    ).toBeFalse()
    expect(
      newState!.subsectors.empty.has('Port Moresby, Papua New Guinea'),
    ).toBeTrue()
    expect(newState!.sectors.get('Port Moresby, Papua New Guinea')!.hp).toBe(0)
  })

  it('should return error invalid target not nanosh structure', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = advance({
      state: gameState,
      characterID: 'Solas Mercer',
      targetSupersectorID: 'Oceanian Front',
      invokeTime: 111,
    }) as [Game, null]
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: newState,
      characterID: 'Solas Mercer',
      invokeTime: 123,
      targetID: 'Brisbane, Australia',
    })

    expect(error?.message).toBe(INVALID_TARGET_NOT_NANOSH)
  })

  it('should return error invalid ship location', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: gameState,
      characterID: 'Solas Mercer',
      invokeTime: 123,
      targetID: gameState?.nanosh.mainBase as SupersectorNames,
    })
    expect(error?.message).toBe(INVALID_SHIP_LOCATION)
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: gameState,
      characterID: 'Solas Mercer',
      invokeTime: 123,
      targetID: 'Port Moresby, Papua New Guinea',
    })
    expect(error?.message).toBe(INVALID_SHIP_LOCATION)
    expect(newState).toBeNull()
  })
})
