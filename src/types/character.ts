import type { Actions } from './actions'
import type { ModifierTracker, ModifiersCharacter } from './modifiers'
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
  | 'Soren Koda'
  | 'Alisa Huang'

export interface Character {
  playerID: string
  ap: number
  maxAP: number
  wounds: Wounds[]
  modifiers: Map<ModifiersCharacter, ModifierTracker>
  dead: boolean
  skills: Set<Skills>
  trait: Set<Traits>
  cycleActions: Map<number, Actions> // invokeTime, Actions
}
