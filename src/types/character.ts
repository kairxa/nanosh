import type { Actions } from './actions'
import type { ModifierTracker, ModifiersCharacter } from './modifiers'
import type { RoomTypes, ShipCargo } from './ship'
import type { Skills } from './skills'
import type { Traits } from './traits'

export type Wounds = 'LW' | 'CW' | 'SLW' | 'SCW' // Light, Critical, L Stabilized, C Stabilized

export type CharacterNames =
  | 'Solas Mercer'
  | 'Momo Tzigane'
  | 'Val'
  | 'Brianne "Bree" Cheeseworth'
  | 'Niral Pierce'
  | `Tee'elise "Teal" Qing`
  | 'X7-Gastronia "Gass" Petalnova'
  | 'Ysara Mercer'
  | 'Zedius Windsor'
  | 'Viero Alden'
  | 'Soren Koda'
  | 'Alisa Huang'
  | 'Rina Mikami'

export type CharacterEquipmentSlots = 'weapon' | 'body' | 'acc-1' | 'acc-2'

export interface Character {
  playerID: string
  ap: number
  maxAP: number
  modifiers: Map<ModifiersCharacter, ModifierTracker>
  skills: Set<Skills>
  trait: Set<Traits>
  cycleActions: Map<number, Actions> // invokeTime, Actions
  inventory: Set<ShipCargo>
  equipment: Map<CharacterEquipmentSlots, ShipCargo>
  location: RoomTypes
}
