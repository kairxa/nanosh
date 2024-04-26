import {
  INVALID_REINFORCE_NOT_ENOUGH_RESOURCES,
  INVALID_REINFORCE_TARGET,
  INVALID_SHIP_LOCATION,
  INVALID_NOT_ENOUGH_AP,
} from '@nanosh/messages/errors'
import { GetInitialGame } from '@nanosh/utils/initialState/game'
import { describe, expect, it } from 'bun:test'
import reinforce from './reinforce'

describe('action.bridge.command.reinforce', () => {
  const [gameState, _] = GetInitialGame()
  const solasMercer = gameState!.characters.get('Solas Mercer')
  solasMercer!.ap = 7
  gameState!.nanosh.liberationPoints.add('Jakarta, Indonesia')
  gameState!.subsectors.empty.delete('Jakarta, Indonesia')
  gameState!.sectors.set('Jakarta, Indonesia', {
    hp: 3,
    supersector: 'SEA Bloc',
  })
  it('should reinforce using supplies', () => {
    const [newState, error] = reinforce({
      invokeTime: 123,
      resourceType: 'supplies',
      targetSubsectorID: 'Jakarta, Indonesia',
      characterID: 'Solas Mercer',
      state: gameState!,
    })
    expect(error).toBe(null)
    expect(newState!.ship.supplies).toBe(200)
    expect(newState!.sectors.get('Jakarta, Indonesia')?.hp).toBe(5)
    expect(newState!.ship.praetorians).toBe(5)
  })
  it('should reinforce using praetorian', () => {
    const [newState, error] = reinforce({
      invokeTime: 123,
      resourceType: 'praetorians',
      targetSubsectorID: 'Jakarta, Indonesia',
      characterID: 'Solas Mercer',
      state: gameState!,
    })
    expect(error).toBe(null)
    expect(newState!.ship.supplies).toBe(240)
    expect(newState!.sectors.get('Jakarta, Indonesia')?.hp).toBe(5)
    expect(newState!.ship.praetorians).toBe(3)
  })
  it('should return error ship location', () => {
    const [newState, error] = reinforce({
      invokeTime: 123,
      resourceType: 'praetorians',
      targetSubsectorID: 'Addis Ababa, Ethiopia',
      characterID: 'Solas Mercer',
      state: gameState!,
    })
    expect(newState).toBe(null)
    expect(error?.message).toBe(INVALID_SHIP_LOCATION)
  })
  it('should return error not a liberation point', () => {
    const [newState, error] = reinforce({
      invokeTime: 123,
      resourceType: 'praetorians',
      targetSubsectorID: 'Kuala Lumpur, Malaysia',
      characterID: 'Solas Mercer',
      state: gameState!,
    })
    expect(newState).toBe(null)
    expect(error?.message).toBe(INVALID_REINFORCE_TARGET)
  })
  it('should return error not enough AP', () => {
    const notEnoughAPState = structuredClone(gameState)
    notEnoughAPState!.characters.get('Solas Mercer')!.ap = 0
    const [newState, error] = reinforce({
      invokeTime: 123,
      resourceType: 'praetorians',
      targetSubsectorID: 'Jakarta, Indonesia',
      characterID: 'Solas Mercer',
      state: notEnoughAPState!,
    })
    expect(newState).toBe(null)
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
  })
  it('should return error not enough supplies', () => {
    const notEnoughSuppliesState = structuredClone(gameState)
    notEnoughSuppliesState!.ship.supplies = 30
    const [newState, error] = reinforce({
      invokeTime: 123,
      resourceType: 'supplies',
      targetSubsectorID: 'Jakarta, Indonesia',
      characterID: 'Solas Mercer',
      state: notEnoughSuppliesState!,
    })
    expect(newState).toBe(null)
    expect(error?.message).toBe(INVALID_REINFORCE_NOT_ENOUGH_RESOURCES)
  })
  it('should return error not enough praetorians', () => {
    const notEnoughSuppliesState = structuredClone(gameState)
    notEnoughSuppliesState!.ship.praetorians = 1
    const [newState, error] = reinforce({
      invokeTime: 123,
      resourceType: 'praetorians',
      targetSubsectorID: 'Jakarta, Indonesia',
      characterID: 'Solas Mercer',
      state: notEnoughSuppliesState!,
    })
    expect(newState).toBe(null)
    expect(error?.message).toBe(INVALID_REINFORCE_NOT_ENOUGH_RESOURCES)
  })
})
