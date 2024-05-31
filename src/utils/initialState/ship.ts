import type { ActionDamage, Actions } from '@nanosh/types/actions'
import type { CharacterNames } from '@nanosh/types/character'
import {
  CANNON_DEFAULT_MAX_DAMAGE,
  CANNON_DEFAULT_MIN_DAMAGE,
} from '@nanosh/types/generic'
import type { ModifierTracker, ModifiersShip } from '@nanosh/types/modifiers'
import type { ProjectNames, ProjectProgress } from '@nanosh/types/projects'
import { type Ship, type ShipCargo, type ShipTypes } from '../../types/ship'
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
    cargo: new Set<ShipCargo>(),
    maxCargoSize: 0,
    eCells: 0,
    supplies: 0,
    rations: 0,
    civitates: 0,
    praetorians: 0,
    rooms: GetInitialShipRooms({ shipType: type }),
    fighterCrafts: GetInitialFighterCrafts({ shipType: type }),
    expoCrafts: GetInitialExpoCrafts({ shipType: type }),
    expo: {
      members: new Set<CharacterNames>(),
    },
    modifiers: new Map<ModifiersShip, ModifierTracker>(),
    projects: {
      queued: new Map<ProjectNames, ProjectProgress>(),
      done: new Set<ProjectNames>(),
      pool: new Set<ProjectNames>([
        'File G11 - Apex Bio Enhancement',
        'File 128 - Finesse Protocol',
        'File 129 - Equilibrium Drive',
        'File 252 - HyperHeal Ampoule',
        'File 253 - Lifesaver Initiative',
        'File 254 - Operational Surge Paradigm',
        'File 311 - Provisioning Overhaul',
        'File E120 - Solo Comfort Initiative',
        'File 100 - Support Blueprints Recovery A',
        'File 101 - Support Blueprints Recovery B',
        'File 112 - EisenSchlag Modul',
        'File 113 - Biogenic Aim Assist',
        'File 456 - Kabuto Boost',
        'File 010 - M22 "Buzzard" Precision Upgrade',
        'File 011 - M22 "Buzzard" Strike Optimization',
        'File 012 - M22 "Buzzard" Defensive Retrofit',
        'File 055 - Hoppers Space Optimization',
        'File 711 - Praetorians Suit Force Distribution',
        "File 712 - Ysara's Snare",
        'File NAP - Nanosh Assimilation Protocol',
      ]),
    },
    damage: new Map<Actions, ActionDamage>([
      [
        'action.bridge.command.cannon',
        { min: CANNON_DEFAULT_MIN_DAMAGE, max: CANNON_DEFAULT_MAX_DAMAGE },
      ],
    ]),
  }

  switch (type) {
    case 'griffin':
      ship.health = 200
      ship.maxHealth = 300
      ship.maxCargoSize = 800
      ship.eCells = 120
      ship.supplies = 240
      ship.rations = 100
      ship.civitates = 10
      ship.praetorians = 5
      break
  }

  return ship
}
