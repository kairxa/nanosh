import type { Character, CharacterNames } from './character'
import type { ItemNames } from './item'
import type {
  Subsector,
  SubsectorNames,
  Supersector,
  SupersectorNames,
} from './sectors'
import type { Ship } from './ship'

export interface Game {
  id: string
  day: number
  cycle: number
  ship: Ship
  morale: number
  maxMorale: number
  nanoshSympathy: number
  maxNanoshSympathy: number
  intel: {
    basic: number
    critical: number
  }
  characters: Map<CharacterNames, Character>
  charactersDead: Set<CharacterNames>
  shipLocation: SupersectorNames
  nanosh: {
    mainBase: SupersectorNames | null
    auxBase: Set<SupersectorNames>
    outposts: Set<SubsectorNames>
    advances: Set<SubsectorNames>
    liberationPoints: Set<SubsectorNames>
    destroyed: {
      outposts: Set<SubsectorNames>
      auxBase: Set<SupersectorNames>
    }
    assimilateEnabled: boolean
  }
  subsectors: {
    empty: Set<SubsectorNames>
  }
  sectors: Map<SupersectorNames | SubsectorNames, Supersector | Subsector>
  craftable: Set<ItemNames>
  anyMap: Map<any, any> // For anything that needs to be stored temporarily, e.g. action.bridge.command.mobilize before confirm
}
