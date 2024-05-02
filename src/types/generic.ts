import type { CharacterNames } from './character'
import type { Game } from './game'

export const ITEM_ID_LENGTH = 8
export const MAX_CYCLE_PER_DAY = 4

export const TOTAL_SUPERSECTORS = 12
export const DEFAULT_ANTARCTICA_SUPERSECTOR_ID = 12
export const DEFAULT_SUBSECTORS_SIZE = 10
export const ANTARCTICA_SUBSECTORS_SIZE = 4

export const MAX_ACTIONS_PER_CYCLE = 3
export const MAX_AP = 12
export const MAX_MORALE = 20
export const MAX_NANOSH_SYMPATHY = 10

export const INITIAL_MORALE = 12
export const INITIAL_NANOSH_SYMPATHY = 0

export const HP_NANOSH_MAIN_BASE = 50
export const HP_NANOSH_AUX_BASE = 25
export const HP_NANOSH_OUTPOST = 10

export const CANNON_DEFAULT_MIN_DAMAGE = 5
export const CANNON_DEFAULT_MAX_DAMAGE = 8

export type BrokenTypes = 'broken' | 'fixed'

export interface Point {
  x: number
  y: number
}

export interface GenericCalculatorParams {
  gameID: string
  state: Game
  invokeTime: number
  playerID: string
  characterID: CharacterNames
}

export type DefaultCalculatorReturnType = [Game | null, Error | null]
