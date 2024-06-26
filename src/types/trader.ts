import type { ItemNames } from './item'

export type TraderResources = 'supplies' | 'rations' | 'eCells' // needs to match key in Ship interface
export interface Trader {
  name: string
  given: TraderResources
  taken: TraderResources
  minTaken: number
  maxTaken: number
  minGiven: number
  maxGiven: number
  items?: Set<{
    minGiven: number
    maxGiven: number
    itemName: ItemNames
  }>
}

export interface TraderShowGiveTake {
  resource: TraderResources
  amount: number
}

export interface TraderShowItem {
  itemName: ItemNames
  given: number
}
export interface TraderShow {
  name: string
  given: TraderShowGiveTake
  taken: TraderShowGiveTake
  items: Set<TraderShowItem>
}
