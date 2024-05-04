import type {
  ConsumableEffects,
  ItemBuildResources,
  ItemNames,
} from '@nanosh/types/item'
import type { ModifiersCharacter } from '@nanosh/types/modifiers'

export const Consumables = new Map<ItemNames, ConsumableEffects>([
  [
    'food.glownana',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.persistent.attrition', { amount: -1 }],
      ]),
      ap: 0,
    },
  ],
  [
    'food.zinglime',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.persistent.drunk', { amount: -1 }],
        ['character.cycle.tired', { amount: -1 }],
      ]),
      ap: 0,
    },
  ],
  [
    'food.frostberry',
    {
      modifiers: new Map([['character.persistent.attrition', { amount: -2 }]]),
      ap: 0,
    },
  ],
  [
    'food.astrotato-fries',
    {
      modifiers: new Map([['character.cycle.hungry', { amount: -1 }]]),
      ap: 0,
    },
  ],
  [
    'food.lightspeed-ramen',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.cycle.hungry', { amount: -2 }],
        ['character.persistent.drunk', { amount: -1 }],
      ]),
      ap: 0,
    },
  ],
  [
    'food.frisbread',
    {
      modifiers: new Map([['character.cycle.hungry', { amount: -1 }]]),
      ap: 0,
    },
  ],
  [
    'food.gourmet-pack',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.cycle.hungry', { amount: -999 }], // ALL hungry
        ['character.day-change.uplifted', { amount: 1 }],
      ]),
      ap: 1,
    },
  ],
  [
    'food.voidplum',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.cycle.hungry', { amount: 1 }],
        ['character.persistent.sick', { amount: -999 }], // ALL sick
      ]),
      ap: 0,
    },
  ],
  [
    'drink.blackmoon',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.cycle.deprived', { amount: -7 }],
        ['character.persistent.drunk', { amount: 2 }],
      ]),
      ap: 0,
    },
  ],
  [
    'drink.hydrocell',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.persistent.attrition', { amount: -2 }],
      ]),
      ap: 0,
    },
  ],
  [
    'drink.bahari-coffee',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.cycle.deprived', { amount: -6 }],
        ['character.persistent.attrition', { amount: -1 }],
      ]),
      ap: 0,
    },
  ],
  [
    'drink.mysterious-green',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.day-change.uplifted', { amount: 1 }],
        ['character.persistent.drunk', { amount: 2 }],
        ['character.persistent.attrition', { amount: -1 }],
        ['character.wound.light', { amount: -1 }],
        ['character.wound.stabilized.light', { amount: 1 }],
      ]),
      ap: 0,
    },
  ],
  [
    'meds.solacil',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.persistent.sick', { amount: -1 }],
      ]),
      ap: 0,
    },
  ],
  [
    'meds.duarin',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.persistent.sick', { amount: -2 }],
      ]),
      ap: 0,
    },
  ],
  [
    'meds.trivagex',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.persistent.sick', { amount: -3 }],
      ]),
      ap: 0,
    },
  ],
  [
    'meds.vigorisk',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.cycle.tired', { amount: 1 }],
      ]),
      ap: 3,
    },
  ],
  [
    'meds.blissbloom',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.cycle.deprived', { amount: -999 }], // ALL deprived
        ['character.persistent.drunk', { amount: 2 }],
      ]),
      ap: 0,
    },
  ],
  [
    'meds.somnoxa',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.cycle.deprived', { amount: -999 }], // ALL deprived
        ['character.cycle.tired', { amount: 2 }],
      ]),
      ap: 0,
    },
  ],
  [
    'meds.lucidix',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.persistent.drunk', { amount: -2 }],
      ]),
      ap: 0,
    },
  ],
  [
    'item.madsegar-vanilla-essence',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.cycle.deprived', { amount: -999 }], // ALL deprived
        ['character.day-change.uplifted', { amount: 1 }],
      ]),
      ap: 0,
    },
  ],
  [
    'item.hyperheal-ampoule',
    {
      modifiers: new Map<ModifiersCharacter, { amount: number }>([
        ['character.wound.light', { amount: -1 }],
        ['character.wound.stabilized.light', { amount: 1 }],
      ]),
      ap: 0,
    },
  ],
])

export const ItemBuilds = new Map<ItemNames, ItemBuildResources>([
  ['weapon.guns.pugio', { eCells: 0, supplies: 13, rations: 0 }],
  ['weapon.guns.principes', { eCells: 0, supplies: 25, rations: 0 }],
  ['weapon.guns.rondel', { eCells: 0, supplies: 18, rations: 0 }],
  ['weapon.guns.heavy.cyclone', { eCells: 3, supplies: 60, rations: 0 }],
  ['weapon.heavy.arcus-driver', { eCells: 5, supplies: 70, rations: 0 }],
  ['weapon.unique.vigiles-45', { eCells: 0, supplies: 9, rations: 0 }],
  ['eq.body.swiftmesh', { eCells: 0, supplies: 22, rations: 0 }],
  ['eq.body.heavy.lorica', { eCells: 0, supplies: 46, rations: 0 }],
  ['acc.force-deflector-shield', { eCells: 0, supplies: 30, rations: 0 }],
  ['acc.omni-converter', { eCells: 1, supplies: 15, rations: 0 }],
  ['item.grenade', { eCells: 0, supplies: 7, rations: 0 }],
  ['item.hyperheal-ampoule', { eCells: 0, supplies: 15, rations: 0 }],
])
