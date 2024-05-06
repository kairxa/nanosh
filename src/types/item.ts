import type { ModifiersCharacter } from './modifiers'

export type ItemNames =
  | 'drink.bahari-coffee'
  | 'drink.blackmoon'
  | 'drink.hydrocell'
  | 'drink.mysterious-green'
  | 'food.astrotato-fries'
  | 'food.frisbread'
  | 'food.frostberry'
  | 'food.glownana'
  | 'food.gourmet-pack'
  | 'food.lightspeed-ramen'
  | 'food.voidplum'
  | 'food.zinglime'
  | 'meds.solacil'
  | 'meds.duarin'
  | 'meds.trivagex'
  | 'meds.vigorisk'
  | 'meds.blissbloom'
  | 'meds.somnoxa'
  | 'meds.lucidix'
  | 'acc.force-deflector-shield'
  | 'acc.lifewater-locket'
  | 'acc.omni-converter'
  | 'acc.voxlink'
  | 'eq.body.heavy.lorica'
  | 'eq.body.swiftmesh'
  | 'item.grenade'
  | 'item.hyperheal-ampoule'
  | 'item.madsegar-vanilla-essence'
  | 'weapon.guns.heavy.cyclone'
  | 'weapon.guns.pugio'
  | 'weapon.guns.principes'
  | 'weapon.guns.p2075'
  | 'weapon.guns.rondel'
  | 'weapon.heavy.arcus-driver'
  | 'weapon.unique.vigiles-45'

export interface ConsumableEffects {
  modifiers: Map<ModifiersCharacter, { amount: number }>
  ap: number
}

export interface ItemBuildResources {
  eCells: number
  supplies: number
  rations: number
}
