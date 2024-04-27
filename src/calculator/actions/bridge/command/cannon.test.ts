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
  const [gameState, _] = GetInitialGame('initial-state-game-test', 1715619600000) as [Game, null]
  const solasMercer = gameState.characters.get('Solas Mercer') as Character
  solasMercer.ap = 7
  solasMercer.playerID = 'my-current-player'
  gameState.ship.modifiers.set('ship.combat.bridge.command.cannon-primed', {
    start: {
      cycle: 1,
      day: 1,
    },
    amount: 1,
    expiry: -1,
  })
  gameState.ship.modifiers.set('ship.day.persistent.engine.optimized', {
    start: {
      cycle: 1,
      day: 1,
    },
    amount: 1,
    expiry: 8,
  })

  it('should fire cannon and damage a target', () => {
    let newState: Game
    let error: null
    ;[newState, error] = advance({
      state: gameState,
      characterID: 'Solas Mercer',
      targetSupersectorID: gameState?.nanosh.mainBase as SupersectorNames,
      invokeTime: 111,
    }) as [Game, null]
    expect(error).toBeNull()

    expect(newState.characters.get('Solas Mercer')?.ap).toBe(6) // advancing once
    expect(newState.ship.eCells).toBe(80)
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: newState,
      characterID: 'Solas Mercer',
      invokeTime: 120,
      targetID: gameState?.nanosh.mainBase as SupersectorNames,
    }) as [Game, null]

    const newCycleActions =
      newState.characters.get('Solas Mercer')?.cycleActions
    expect(newCycleActions?.get(111)).toBe('action.bridge.command.advance')
    expect(newCycleActions?.get(120)).toBe('action.bridge.command.cannon')
    expect(newState.characters.get('Solas Mercer')?.ap).toBe(6) // still same
    expect(newState.ship.eCells).toBe(80) // still same, cannon-prime
    expect(
      newState.sectors.get(gameState.nanosh.mainBase as SupersectorNames)?.hp,
    ).toBe(44) // random damage, cool
    expect(
      newState.ship.modifiers.has('ship.combat.bridge.command.cannon-primed'),
    ).toBe(false)
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: newState,
      characterID: 'Solas Mercer',
      invokeTime: 121,
      targetID: gameState?.nanosh.mainBase as SupersectorNames,
    }) as [Game, null]

    expect(newState.characters.get('Solas Mercer')?.ap).toBe(5)
    expect(newState.ship.eCells).toBe(75) // only reduced 5, engine optimized
    expect(
      newState.sectors.get(gameState.nanosh.mainBase as SupersectorNames)?.hp,
    ).toBe(39)
    newState.ship.modifiers.delete('ship.day.persistent.engine.optimized') // remove engine optimized
    // Emulate destroying main base
    newState.sectors.get(gameState.nanosh.mainBase as SupersectorNames)!.hp = 5
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: newState,
      characterID: 'Solas Mercer',
      invokeTime: 122,
      targetID: gameState?.nanosh.mainBase as SupersectorNames,
    }) as [Game, null]

    expect(newState.ship.eCells).toBe(65) // reduced by 10
    expect(
      newState.sectors.get(gameState.nanosh.mainBase as SupersectorNames)?.hp,
    ).toBe(0)
    expect(newState.nanosh.mainBase).toBeNull()
    expect(newState.characters.get('Solas Mercer')?.cycleActions.size).toBe(4) // shouldn't be possible, as max action per cycle is 3. But for the sake of testing.
  })

  it('should remove aux base', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = advance({
      state: gameState,
      characterID: 'Solas Mercer',
      targetSupersectorID: 'North American Union',
      invokeTime: 111,
    })
    newState!.sectors.get('North American Union')!.hp = 4
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: newState!,
      characterID: 'Solas Mercer',
      invokeTime: 123,
      targetID: 'North American Union',
    })

    expect(error).toBeNull()
    expect(newState!.nanosh.auxBase.has('North American Union')).toBe(false)
    expect(newState!.sectors.get('North American Union')!.hp).toBe(0)
  })

  it('should remove outpost', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = advance({
      state: gameState,
      characterID: 'Solas Mercer',
      targetSupersectorID: 'Oceanian Front',
      invokeTime: 111,
    })
    newState!.sectors.get('Wellington, New Zealand')!.hp = 4
    ;[newState, error] = cannon({
      gameID: 'cannon-test',
      state: newState!,
      characterID: 'Solas Mercer',
      invokeTime: 123,
      targetID: 'Wellington, New Zealand',
    })

    expect(error).toBeNull()
    expect(newState!.nanosh.outposts.has('Wellington, New Zealand')).toBe(false)
    expect(newState!.subsectors.empty.has('Wellington, New Zealand')).toBe(true)
    expect(newState!.sectors.get('Wellington, New Zealand')!.hp).toBe(0)
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
      targetID: 'Wellington, New Zealand',
    })
    expect(error?.message).toBe(INVALID_SHIP_LOCATION)
    expect(newState).toBeNull()
  })
})
