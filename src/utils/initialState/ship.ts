import type { ModifierTracker, ModifiersShip } from '@nanosh/types/modifiers'
import type { Ship, ShipTypes } from '../../types/ship'
import { GetInitialExpoCrafts, GetInitialFighterCrafts } from './aircrafts'
import { GetInitialShipRooms } from './rooms'

export interface GetInitialShipParams {
  type: ShipTypes
}
export const GetInitialShip = (
  { type }: GetInitialShipParams = { type: 'griffin' },
): Ship => {
  const ship: Ship = {
    type,
    health: 0,
    maxHealth: 0,
    cargo: 0,
    maxCargo: 0,
    eCells: 0,
    supplies: 0,
    rations: 0,
    civitates: 0,
    praetorians: 0,
    rooms: GetInitialShipRooms({ shipType: type }),
    fighterCrafts: GetInitialFighterCrafts({ shipType: type }),
    expoCrafts: GetInitialExpoCrafts({ shipType: type }),
    modifiers: new Map<ModifiersShip, ModifierTracker>(),
  }

  switch (type) {
    case 'griffin':
      ship.health = 200
      ship.maxHealth = 300
      ship.cargo = 0
      ship.maxCargo = 800
      ship.eCells = 120
      ship.supplies = 240
      ship.rations = 100
      ship.civitates = 10
      ship.praetorians = 5
      break
  }

  return ship
}
