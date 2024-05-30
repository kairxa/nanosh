import type { Actions } from '@nanosh/types/actions'
import type {
  Character,
  CharacterEquipmentSlots,
  CharacterNames,
} from '@nanosh/types/character'
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
        inventory: new Set<ShipCargo>(),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'weapon',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'weapon.unique.guns.p2075',
              broken: false,
            },
          ],
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      'Momo Tzigane',
      {
        ap: 0,
        maxAP: MAX_AP,
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
        inventory: new Set<ShipCargo>(),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'weapon',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'weapon.guns.principes',
              broken: false,
            },
          ],
          [
            'body',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'body.heavy.lorica',
              broken: false,
            },
          ],
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      'Val',
      {
        ap: 0,
        maxAP: MAX_AP,
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
        inventory: new Set<ShipCargo>(),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'weapon',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'weapon.unique.vigiles-45',
              broken: false,
            },
          ],
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.omni-converter',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      'Brianne "Bree" Cheeseworth',
      {
        ap: 0,
        maxAP: MAX_AP,
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
        inventory: new Set<ShipCargo>(),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'weapon',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'weapon.guns.rondel',
              broken: false,
            },
          ],
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      'Niral Pierce',
      {
        ap: 0,
        maxAP: MAX_AP,
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
        inventory: new Set<ShipCargo>(),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'weapon',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'meds.vigorisk',
              broken: false,
            },
          ],
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      `Tee'elise "Teal" Qing`,
      {
        ap: 0,
        maxAP: MAX_AP,
        trait: new Set<Traits>(['trait.amorous']),
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
            itemName: 'meds.somnoxa',
            broken: false,
          },
        ]),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'weapon',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'weapon.guns.rondel',
              broken: false,
            },
          ],
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      'X7-Gastronia "Gass" Petalnova',
      {
        ap: 0,
        maxAP: MAX_AP,
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
        inventory: new Set<ShipCargo>(),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      'Ysara Mercer',
      {
        ap: 0,
        maxAP: MAX_AP,
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
        inventory: new Set<ShipCargo>(),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'weapon',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'weapon.guns.pugio',
              broken: false,
            },
          ],
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      'Zedius Windsor',
      {
        ap: 0,
        maxAP: MAX_AP,
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
        inventory: new Set<ShipCargo>(),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      'Viero Alden',
      {
        ap: 0,
        maxAP: MAX_AP,
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
        inventory: new Set<ShipCargo>(),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'weapon',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'weapon.guns.pugio',
              broken: false,
            },
          ],
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      'Soren Koda',
      {
        ap: 0,
        maxAP: MAX_AP,
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
        inventory: new Set<ShipCargo>([]),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'weapon',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'weapon.guns.pugio',
              broken: false,
            },
          ],
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      'Alisa Huang',
      {
        ap: 0,
        maxAP: MAX_AP,
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
        inventory: new Set<ShipCargo>(),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
    [
      'Rina Mikami',
      {
        ap: 0,
        maxAP: MAX_AP,
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
        inventory: new Set<ShipCargo>(),
        equipment: new Map<CharacterEquipmentSlots, ShipCargo>([
          [
            'acc-1',
            {
              id: GetRandomString(ITEM_ID_LENGTH, prng),
              itemName: 'acc.voxlink',
              broken: false,
            },
          ],
        ]),
        location: 'dorms',
      },
    ],
  ])
}
