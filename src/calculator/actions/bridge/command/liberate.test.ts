import {
  FATAL_LIBERATE_REDUCE_ADVANCE_SUBSECTOR_NAME_MISMATCH,
  FATAL_SHIP_LOCATION_STORE_MISMATCH,
  INVALID_LIBERATE_NO_LIBPO,
  INVALID_NOT_ENOUGH_AP,
} from '@nanosh/messages/errors'
import type { Character } from '@nanosh/types/character'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import liberate from './liberate'
import mobilize, { mobilizeConfirm } from './mobilize'

describe('action.bridge.command.liberate', () => {
  const [gameState, _] = GetInitialGame(
    'initial-state-game-test',
    1715619600000,
  )
  const solasMercer = gameState!.characters.get('Solas Mercer')
  solasMercer!.ap = 7
  gameState!.sectors.set('Jakarta, Indonesia', {
    hp: 3,
    supersector: 'SEA Bloc',
  })
  gameState!.sectors.set('Kuala Lumpur, Malaysia', {
    hp: 3,
    supersector: 'SEA Bloc',
  })
  gameState!.sectors.set('Manila, Philippines', {
    hp: 3,
    supersector: 'SEA Bloc',
  })
  gameState!.sectors.set('Bangkok, Thailand', {
    hp: 1,
    supersector: 'SEA Bloc',
  })
  gameState!.sectors.set('Ho Chi Minh City, Vietnam', {
    hp: 2,
    supersector: 'SEA Bloc',
  })
  gameState!.sectors.set('Singapore, Singapore', {
    hp: 2,
    supersector: 'SEA Bloc',
  })
  gameState!.nanosh.liberationPoints.add('Jakarta, Indonesia')
  gameState!.nanosh.liberationPoints.add('Kuala Lumpur, Malaysia')
  gameState!.nanosh.liberationPoints.add('Manila, Philippines')
  gameState!.nanosh.advances.add('Bangkok, Thailand')
  gameState!.nanosh.advances.add('Ho Chi Minh City, Vietnam')
  gameState!.nanosh.advances.add('Singapore, Singapore')
  gameState!.subsectors.empty.delete('Jakarta, Indonesia')
  gameState!.subsectors.empty.delete('Kuala Lumpur, Malaysia')
  gameState!.subsectors.empty.delete('Manila, Philippines')
  gameState!.subsectors.empty.delete('Bangkok, Thailand')
  gameState!.subsectors.empty.delete('Ho Chi Minh City, Vietnam')
  gameState!.subsectors.empty.delete('Singapore, Singapore')

  it('should liberate outposts', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState!)
    newState.nanosh.outposts.add('Bali, Indonesia')
    newState.nanosh.outposts.add('Pontianak, Indonesia')
    newState.nanosh.outposts.add('Phnom Penh, Cambodia')
    newState.nanosh.outposts.add('Hanoi, Vietnam')
    newState.subsectors.empty.delete('Bali, Indonesia')
    newState.subsectors.empty.delete('Pontianak, Indonesia')
    newState.subsectors.empty.delete('Phnom Penh, Cambodia')
    newState.subsectors.empty.delete('Hanoi, Vietnam')
    newState.sectors.set('Bali, Indonesia', { hp: 6, supersector: 'SEA Bloc' })
    newState.sectors.set('Pontianak, Indonesia', {
      hp: 6,
      supersector: 'SEA Bloc',
    })
    newState.sectors.set('Phnom Penh, Cambodia', {
      hp: 6,
      supersector: 'SEA Bloc',
    })
    newState.sectors.set('Hanoi, Vietnam', { hp: 6, supersector: 'SEA Bloc' })
    expect(newState.nanosh.outposts.size).toBe(7)
    ;[newState, error] = liberate({
      state: newState,
      invokeTime: 123,
      gameID: 'liberate-outposts',
      characterID: 'Solas Mercer',
    })
    expect(error).toBeNull()
    expect(newState?.nanosh.outposts.size).toBe(4)
    expect(newState?.subsectors.empty.has('Pontianak, Indonesia')).toBeFalse()
    expect(newState?.subsectors.empty.has('Bali, Indonesia')).toBeTrue()
    expect(newState?.subsectors.empty.has('Phnom Penh, Cambodia')).toBeTrue()
    expect(newState?.subsectors.empty.has('Hanoi, Vietnam')).toBeTrue()
    expect(newState?.sectors.get('Pontianak, Indonesia')?.hp).toBe(6)
    expect(newState?.sectors.get('Bali, Indonesia')?.hp).toBe(0)
    expect(newState?.sectors.get('Phnom Penh, Cambodia')?.hp).toBe(0)
    expect(newState?.sectors.get('Hanoi, Vietnam')?.hp).toBe(0)
    expect(newState?.nanosh.destroyed.outposts.has('Hanoi, Vietnam')).toBeTrue()
    expect(
      newState?.nanosh.destroyed.outposts.has('Pontianak, Indonesia'),
    ).toBeFalse()
    expect(
      newState?.nanosh.destroyed.outposts.has('Phnom Penh, Cambodia'),
    ).toBeTrue()
    expect(
      newState?.nanosh.destroyed.outposts.has('Bali, Indonesia'),
    ).toBeTrue()
    expect(
      newState?.characters.get('Solas Mercer')?.cycleActions.get(123),
    ).toBe('action.bridge.command.liberate')
    expect(newState?.characters.get('Solas Mercer')?.ap).toBe(6)
    expect(newState?.sectors.get('Singapore, Singapore')?.hp).toBe(1)
    expect(newState?.sectors.get('Bangkok, Thailand')?.hp).toBe(0)
    expect(newState?.sectors.get('Ho Chi Minh City, Vietnam')?.hp).toBe(1)
  })

  it('should liberate aux base', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState!)
    newState.shipLocation = 'North American Union'
    ;[newState, error] = mobilize({
      state: newState!,
      invokeTime: 123,
      gameID: 'mobilize-before-liberate',
      characterID: 'Solas Mercer',
      targetSubsectorID: 'Toronto, Canada',
    })
    ;[newState, error] = mobilizeConfirm({
      gameID: 'mobilize-before-liberate',
      characterID: 'Solas Mercer',
      state: newState!,
    })
    ;[newState, error] = liberate({
      state: newState!,
      invokeTime: 123,
      gameID: 'liberate-auxbase',
      characterID: 'Solas Mercer',
    })
    expect(error).toBeNull()
    expect(newState?.nanosh.auxBase.has('North American Union')).toBeFalse()
    expect(
      newState?.nanosh.destroyed.auxBase.has('North American Union'),
    ).toBeTrue()
    expect(newState?.sectors.get('North American Union')?.hp).toBe(0)
  })

  it('should invalidate request due to ship location', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState!.sectors.delete('SEA Bloc')
    ;[newState, error] = liberate({
      state: newState!,
      invokeTime: 123,
      gameID: 'liberate-invalid-location',
      characterID: 'Solas Mercer',
    })
    expect(newState).toBeNull()
    expect(error?.message).toBe(FATAL_SHIP_LOCATION_STORE_MISMATCH)
  })

  it('should invalidate request due to no liberation point in supersector', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState!.shipLocation = 'South Asian Network'
    ;[newState, error] = liberate({
      state: newState!,
      invokeTime: 123,
      gameID: 'liberate-empty-libpo',
      characterID: 'Solas Mercer',
    })
    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_LIBERATE_NO_LIBPO)
  })

  it('should invalidate request due to not enough AP', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState!.characters.set('Solas Mercer', {
      ...(newState!.characters.get('Solas Mercer') as Character),
      ap: 0,
    })
    ;[newState, error] = liberate({
      state: newState!,
      invokeTime: 123,
      gameID: 'liberate-not-enough-ap',
      characterID: 'Solas Mercer',
    })
    expect(newState).toBeNull()
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })

  it('should invalidate request due to invalid subsector during removing advances', () => {
    let newState: Game | null
    let error: Error | null
    newState = structuredClone(gameState)
    newState?.sectors.delete('Singapore, Singapore')
    ;[newState, error] = liberate({
      state: newState!,
      invokeTime: 123,
      gameID: 'liberate-invalid-subsector-advances',
      characterID: 'Solas Mercer',
    })
    // expect(newState).toBeNull()
    expect(error?.message).toBe(
      `${FATAL_LIBERATE_REDUCE_ADVANCE_SUBSECTOR_NAME_MISMATCH}: Singapore, Singapore`,
    )
  })
})
