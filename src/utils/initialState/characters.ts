import type { Actions } from '@nanosh/types/actions'
import type { Character, CharacterNames } from '@nanosh/types/character'
import { ITEM_ID_LENGTH, MAX_AP } from '@nanosh/types/generic'
import type {
  ModifierTracker,
  ModifiersCharacter,
} from '@nanosh/types/modifiers'
import type { ShipCargo } from '@nanosh/types/ship'
import type { Skills } from '@nanosh/types/skills'
import type { Traits } from '@nanosh/types/traits'
import seedrandom from 'seedrandom'
import GetRandomString from '../getRandomString'

export const GetInitialCharacters = (
  gameID: string,
  invokeTime: number,
): Map<CharacterNames, Character> => {
  const prng = seedrandom(`${gameID}-${invokeTime}`)

  return new Map<CharacterNames, Character>([
    [
      'Solas Mercer',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.legatus-legionis']),
        skills: new Set<Skills>([
          'skill.triarii',
          'skill.tactician',
          'skill.experienced-commander',
          'skill.visionary',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'weapon.guns.p2075',
          },
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
    [
      'Momo Tzigane',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.defender']),
        skills: new Set<Skills>([
          'skill.infantry',
          'skill.protector',
          'skill.triarii',
          'skill.stalwart',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'weapon.guns.principes',
          },
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'eq.body.heavy.lorica',
          },
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
    [
      'Val',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.hardworking']),
        skills: new Set<Skills>([
          'skill.technician',
          'skill.engineer',
          'skill.artisan',
          'skill.diligent',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'weapon.unique.vigiles-45',
          },
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.omni-converter',
          },
        ]),
      },
    ],
    [
      'Brianne "Bree" Cheeseworth',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.gung-ho']),
        skills: new Set<Skills>([
          'skill.pirate',
          'skill.agile',
          'skill.mechpilot',
          'skill.engineer',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'weapon.guns.rondel',
          },
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
    [
      'Niral Pierce',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.meticulous']),
        skills: new Set<Skills>([
          'skill.surgeon',
          'skill.physician',
          'skill.pharmacologist',
          'skill.savant',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'meds.vigorisk',
          },
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
    [
      `Tee'elise "Teal" Qing`,
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.amorous', 'trait.popular']),
        skills: new Set<Skills>([
          'skill.technician',
          'skill.engineer',
          'skill.artisan',
          'skill.diligent',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'weapon.guns.rondel',
          },
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'meds.somnoxa',
          },
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
    [
      'X7-Gastronia "Gass" Petalnova',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.droid']),
        skills: new Set<Skills>([
          'skill.botanist',
          'skill.cook',
          'skill.engineer',
          'skill.demolition',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
    [
      'Ysara Mercer',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.driven']),
        skills: new Set<Skills>([
          'skill.prodigy-leader',
          'skill.aviator',
          'skill.shooter',
          'skill.tactician',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'weapon.guns.pugio',
          },
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
    [
      'Zedius Windsor',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.calm']),
        skills: new Set<Skills>([
          'skill.technician',
          'skill.protector',
          'skill.mechpilot',
          'skill.stalwart',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
    [
      'Viero Alden',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.ace']),
        skills: new Set<Skills>([
          'skill.aviator',
          'skill.guns-fundamental',
          'skill.stalwart',
          'skill.visionary',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'weapon.guns.pugio',
          },
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
    [
      'Soren Koda',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.dutiful']),
        skills: new Set<Skills>([
          'skill.sniper',
          'skill.guns-fundamental',
          'skill.diligent',
          'skill.adaptable',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'weapon.guns.pugio',
          },
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
    [
      'Alisa Huang',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.popular']),
        skills: new Set<Skills>([
          'skill.comms-savvy',
          'skill.persuasion',
          'skill.logistician',
          'skill.cook',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
    [
      'Rina Mikami',
      {
        ap: 0,
        maxAP: MAX_AP,
        dead: false,
        trait: new Set<Traits>(['trait.regenesis']),
        skills: new Set<Skills>([
          'skill.silver',
          'skill.adaptable',
          'skill.savant',
          'skill.visionary',
        ]),
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
        inventory: new Set<ShipCargo>([
          {
            id: GetRandomString(ITEM_ID_LENGTH, prng),
            itemName: 'acc.voxlink',
          },
        ]),
      },
    ],
  ])
}
