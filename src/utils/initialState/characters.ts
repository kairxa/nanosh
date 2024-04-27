import type { Actions } from '@nanosh/types/actions'
import type { Character, CharacterNames } from '@nanosh/types/character'
import { MAX_AP } from '@nanosh/types/generic'
import type {
  ModifierTracker,
  ModifiersCharacter,
} from '@nanosh/types/modifiers'
import type { Skills } from '@nanosh/types/skills'
import type { Traits } from '@nanosh/types/traits'

export const GetInitialCharacters = (): Map<CharacterNames, Character> => {
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
        wounds: [],
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
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
          'skill.shooter',
          'skill.protector',
          'skill.cqc',
          'skill.stalwart',
        ]),
        wounds: [],
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
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
        wounds: [],
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
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
        wounds: [],
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
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
        wounds: [],
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
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
        wounds: [],
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
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
          'skill.cqc',
          'skill.demolition',
        ]),
        wounds: [],
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
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
        wounds: [],
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
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
        wounds: [],
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
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
        wounds: [],
        modifiers: new Map<ModifiersCharacter, ModifierTracker>(),
        playerID: '',
        cycleActions: new Map<number, Actions>(),
      },
    ],
  ])
}
