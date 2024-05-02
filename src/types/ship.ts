import type { ActionDamage, Actions } from './actions'
import type { BrokenTypes } from './generic'
import type { ItemName } from './item'
import type { ModifierTracker, ModifiersShip } from './modifiers'
import type { ProjectNames, ProjectProgress } from './projects'

export type FighterCraftTypes = 'buzzard'
export type ExpoCraftTypes = 'blitzhopper' | 'forthopper'

export const AircraftNames = new Map<
  FighterCraftTypes | ExpoCraftTypes,
  string
>([
  ['buzzard', 'M-22 "Buzzard"'],
  ['blitzhopper', 'S-11 "Blitzhopper"'],
])

export interface FighterCraft {
  type: FighterCraftTypes
  broken: BrokenTypes[]
}

export interface ExpoCraft {
  type: ExpoCraftTypes
  health: number
  maxHealth: number
}

export type RoomTypes =
  | 'bridge'
  | 'garden'
  | 'refectory'
  | 'rnd'
  | 'medlab'
  | 'life-support'
  | 'storage'
  | 'private-quarters'
  | 'common-area'
  | 'dorms'
  | 'barracks'
  | 'weapon-systems'
  | 'fightercrafts-bay'
  | 'expocrafts-bay'
  | 'flak-turret'
  | 'laser-turret'
  | 'armory'
  | 'engine-room'
  | 'corridor'
  | 'hallway'
  | 'plating'

export interface Room {
  type: RoomTypes
  name: string
  broken: BrokenTypes[] // ['fixed', 'fixed', 'broken'], so we can track how many times it has been broken in one field.
}

export interface ShipModifierDetails {
  title: string
  description: string
}

export const ShipModifierDetails = new Map<ModifiersShip, ShipModifierDetails>([
  [
    'ship.day-change.bridge.comms.mobilization',
    {
      title: 'Mobilization',
      description: 'Gain 4-8 Civitates the next day.',
    },
  ],
  [
    'ship.day-change.garden.forage',
    {
      title: 'Garden: Foraging',
      description: 'Gives sapped status to the garden next day.',
    },
  ],
  [
    'ship.day-change.garden.grow',
    {
      title: 'Garden: Growing',
      description: 'Gives bountiful status to the garden next day',
    },
  ],
  [
    'ship.day-change.supersector.hearthbeat',
    {
      title: 'Supersector: Hearthbeat',
      description: 'Gain 1 AP the next day for one random character.',
    },
  ],
  [
    'ship.persistent.garden.bountiful',
    {
      title: 'Garden: Bountiful',
      description: '150% harvest result.',
    },
  ],
  [
    'ship.persistent.buzzard.optimized',
    {
      title: 'Buzzard Optimized',
      description: '50% eCells usage for all buzzard bay actions.',
    },
  ],
  [
    'ship.persistent.engine.optimized',
    {
      title: 'Engine Optimized',
      description: '50% eCells usage for all command terminal actions.',
    },
  ],
  [
    'ship.persistent.weapon.optimized',
    {
      title: 'Weapon Optimized',
      description: '50% eCells usage for all turret systems actions.',
    },
  ],
  [
    'ship.persistent.garden.sapped',
    {
      title: 'Garden: Sapped',
      description: '50% harvest result.',
    },
  ],
  [
    'ship.cycle.storage.broken',
    {
      title: 'Storage: Broken',
      description: '50% max cargo capacity. Lose 10% cargo every cycle.',
    },
  ],
  [
    'ship.combat.armory.broken',
    {
      title: 'Armory: Broken',
      description: '50% ground combat strength.',
    },
  ],
  [
    'ship.combat.bridge.command.cannon-primed',
    {
      title: 'Command: Cannon Primed',
      description:
        'Uses no eCells and AP on next cannon action. Remove 11-30 ground threat on next assault action. Removed when either action is taken.',
    },
  ],
])

export type ShipTypes = 'griffin'
export const ShipNames = new Map<ShipTypes, string>([
  ['griffin', 'GX-03 "Griffin Guardian"'],
])

export interface ShipCargo {
  id: string
  itemName: ItemName
}

export interface Ship {
  type: ShipTypes
  health: number
  maxHealth: number
  cargo: Set<ShipCargo>
  maxCargoSize: number
  eCells: number
  supplies: number
  rations: number
  civitates: number
  praetorians: number
  rooms: Map<string, Room>
  fighterCrafts: Map<number, FighterCraft>
  expoCrafts: Map<number, ExpoCraft>
  modifiers: Map<ModifiersShip, ModifierTracker>
  projects: {
    queued: Map<ProjectNames, ProjectProgress>
    done: Set<ProjectNames>
    pool: Set<ProjectNames>
  }
  // Actually actions damage. For cannon action inside bridge or gun actions during CBD
  damage: Map<Actions, ActionDamage>
}
