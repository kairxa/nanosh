import {
  INVALID_MOBILIZE_NOT_ENOUGH_RESOURCES,
  INVALID_MOBILIZE_TARGET,
  INVALID_SHIP_LOCATION,
  INVALID_NOT_ENOUGH_AP,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import advance from './advance'
import mobilize, { mobilizeConfirm, mobilizeRefuse } from './mobilize'

describe('action.bridge.command.mobilize', () => {
  const [gameState, _] = GetInitialGame()
  const solasMercer = gameState!.characters.get('Solas Mercer')
  solasMercer!.ap = 7
  it('should mobilize and generate required resources and then confirm', () => {
    // expect generated resources are saved
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = mobilize({
      state: gameState!,
      gameID: 'testing-mobilize',
      invokeTime: 123,
      characterID: 'Solas Mercer',
      targetSubsectorID: 'Jakarta, Indonesia',
    })
    expect(error).toBe(null)
    expect(
      newState?.anyMap.get('testing-mobilize-Solas Mercer-mobilize'),
    ).toEqual({
      pickedSacrifice: 'supplies',
      supplies: 35,
      eCells: 5,
      civitates: 15,
      targetSubsectorID: 'Jakarta, Indonesia',
    })
    // expect character cycle actions are added
    let newSolasMercer = newState!.characters.get('Solas Mercer')
    expect(newSolasMercer!.cycleActions.get(123)).toBe(
      'action.bridge.command.mobilize',
    )
    // expect character ap is reduced
    expect(newSolasMercer!.ap).toBe(6)
    // after confirm, expect character ap is still the same
    ;[newState, error] = mobilizeConfirm({
      state: newState!,
      characterID: 'Solas Mercer',
      gameID: 'testing-mobilize',
    })
    // expect character cycle actions are still the same
    newSolasMercer = newState!.characters.get('Solas Mercer')
    expect(newSolasMercer!.cycleActions.size).toBe(1)
    expect(newSolasMercer!.ap).toBe(6)
    expect(newState?.ship.supplies).toBe(205)
    expect(newState?.subsectors.empty.has('Jakarta, Indonesia')).toBe(false)
    expect(newState?.sectors.get('Jakarta, Indonesia')?.hp).toBe(3)
    expect(newState?.nanosh.liberationPoints.has('Jakarta, Indonesia')).toBe(
      true,
    )
    // expect saved generated resources has been deleted
    expect(
      newState?.anyMap.get('testing-mobilize-Solas Mercer-mobilize'),
    ).not.toBeDefined()
  })

  it('should validate ship location', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = mobilize({
      state: gameState!,
      gameID: 'testing-mobilize',
      invokeTime: 123,
      characterID: 'Solas Mercer',
      targetSubsectorID: 'Omsk, Russia',
    })
    expect(newState).toBe(null)
    expect(error?.message).toBe(INVALID_SHIP_LOCATION)
  })

  it('should validate emptiness of targetSubsectorID', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = advance({
      characterID: 'Solas Mercer',
      invokeTime: 121,
      state: gameState!,
      targetSupersectorID: 'European Federation',
    })
    ;[newState, error] = mobilize({
      state: newState!,
      invokeTime: 123,
      characterID: 'Solas Mercer',
      targetSubsectorID: 'Berlin, Germany',
      gameID: 'testing-mobilize',
    })

    expect(newState).toBe(null)
    expect(error?.message).toBe(INVALID_MOBILIZE_TARGET)
  })

  it('should validate AP usage', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = advance({
      characterID: 'Solas Mercer',
      invokeTime: 121,
      state: gameState!,
      targetSupersectorID: 'European Federation',
    })
    newState!.characters.get('Solas Mercer')!.ap = 0
    ;[newState, error] = mobilize({
      gameID: 'testing-mobilize',
      targetSubsectorID: 'Amsterdam, Netherlands',
      characterID: 'Solas Mercer',
      invokeTime: 123,
      state: newState!,
    })
    expect(newState).toBe(null)
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })

  it('should validate owned selected resource', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = advance({
      characterID: 'Solas Mercer',
      invokeTime: 121,
      state: gameState!,
      targetSupersectorID: 'European Federation',
    })
    newState!.ship.supplies = 10
    ;[newState, error] = mobilize({
      gameID: 'testing-mobilize',
      targetSubsectorID: 'Amsterdam, Netherlands',
      characterID: 'Solas Mercer',
      invokeTime: 123,
      state: newState!,
    })
    expect(newState).toBe(null)
    expect(error?.message).toBe(
      `${INVALID_MOBILIZE_NOT_ENOUGH_RESOURCES} - Requested: supplies with amount 35`,
    )
  })

  it('should properly refuse mobilize', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = mobilize({
      state: gameState!,
      gameID: 'testing-mobilize',
      invokeTime: 123,
      characterID: 'Solas Mercer',
      targetSubsectorID: 'Jakarta, Indonesia',
    })
    expect(error).toBe(null)
    expect(
      newState?.anyMap.get('testing-mobilize-Solas Mercer-mobilize'),
    ).toEqual({
      pickedSacrifice: 'supplies',
      supplies: 35,
      eCells: 5,
      civitates: 15,
      targetSubsectorID: 'Jakarta, Indonesia',
    })
    ;[newState, error] = mobilizeRefuse({
      state: newState!,
      characterID: 'Solas Mercer',
      gameID: 'testing-mobilize',
    })
    expect(
      newState?.anyMap.get('testing-mobilize-Solas Mercer-mobilize'),
    ).not.toBeDefined()
  })

  it('should not confirm action when resource has been changed in between mobilize and confirm', () => {
    let newState: Game | null
    let error: Error | null
    ;[newState, error] = mobilize({
      state: gameState!,
      gameID: 'testing-mobilize',
      invokeTime: 123,
      characterID: 'Solas Mercer',
      targetSubsectorID: 'Jakarta, Indonesia',
    })
    expect(error).toBe(null)
    newState!.ship.supplies = 10
    ;[newState, error] = mobilizeConfirm({
      state: newState!,
      characterID: 'Solas Mercer',
      gameID: 'testing-mobilize',
    })
    expect(newState).toBe(null)
    expect(error?.message).toBe(
      `${INVALID_MOBILIZE_NOT_ENOUGH_RESOURCES} - Requested: supplies with amount 35`,
    )
  })
})
