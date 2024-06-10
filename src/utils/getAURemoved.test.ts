import type { AerialUnits } from '@nanosh/types/game'
import type {
  ModifiersCharacter,
  ModifierTracker,
} from '@nanosh/types/modifiers'
import type { ProjectNames } from '@nanosh/types/projects'
import type { Traits } from '@nanosh/types/traits'
import { describe, expect, it } from 'bun:test'
import seedrandom from 'seedrandom'
import GetAURemoved, { getRandomizedAUAllocation } from './getAURemoved'

describe('GetAURemoved', () => {
  it('should get au removed detail - flak-turret.shoot', () => {
    const auRemovedDetail = GetAURemoved({
      actionName: 'action.flak-turret.shoot',
      characterTraits: new Set<Traits>(),
      characterModifier: new Map<ModifiersCharacter, ModifierTracker>(),
      projectsDone: new Set<ProjectNames>(),
      currentAU: { hornets: 2, talons: 0 },
      prng: seedrandom('flak-turret-shoot-12345'),
    })

    expect(auRemovedDetail).toStrictEqual({
      hornets: 1,
      talons: 0,
      diceResult: 5,
    })
  })

  it('should get au removed detail - laser-turret.shoot', () => {
    const auRemovedDetail = GetAURemoved({
      actionName: 'action.laser-turret.shoot',
      characterTraits: new Set<Traits>(),
      characterModifier: new Map<ModifiersCharacter, ModifierTracker>(),
      projectsDone: new Set<ProjectNames>(),
      currentAU: { hornets: 2, talons: 0 },
      prng: seedrandom('laser-turret-shoot-12345'),
    })

    expect(auRemovedDetail).toStrictEqual({
      hornets: 1,
      talons: 0,
      diceResult: 3,
    })
  })

  it('should get au removed detail - fightercrafts-bay.dogfight plain', () => {
    const auRemovedDetail = GetAURemoved({
      actionName: 'action.fightercrafts-bay.dogfight',
      characterTraits: new Set<Traits>(),
      characterModifier: new Map<ModifiersCharacter, ModifierTracker>(),
      projectsDone: new Set<ProjectNames>(),
      currentAU: { hornets: 7, talons: 4 },
      prng: seedrandom('fightercrafts-bay-dogfight-12345'),
    })

    expect(auRemovedDetail).toStrictEqual({
      hornets: 5,
      talons: 3,
      diceResult: 1,
    })
  })

  it('should get au removed detail - fightercrafts-bay.dogfight drunk', () => {
    const auRemovedDetail = GetAURemoved({
      actionName: 'action.fightercrafts-bay.dogfight',
      characterTraits: new Set<Traits>(),
      characterModifier: new Map<ModifiersCharacter, ModifierTracker>([
        [
          'character.persistent.drunk',
          {
            start: { day: 1, cycle: 1 },
            expiry: { day: 1, cycle: 4 },
            amount: 3,
          },
        ],
      ]),
      projectsDone: new Set<ProjectNames>(),
      currentAU: { hornets: 5, talons: 3 },
      prng: seedrandom('fightercrafts-bay-dogfight-12345'),
    })

    expect(auRemovedDetail).toStrictEqual({
      hornets: 3,
      talons: 2,
      diceResult: 1,
    })
  })

  it('should get au removed detail - fightercrafts-bay.dogfight trait ace with ace dice', () => {
    const auRemovedDetail = GetAURemoved({
      actionName: 'action.fightercrafts-bay.dogfight',
      characterTraits: new Set<Traits>(['trait.ace']),
      characterModifier: new Map<ModifiersCharacter, ModifierTracker>(),
      projectsDone: new Set<ProjectNames>(),
      currentAU: { hornets: 8, talons: 8 },
      prng: seedrandom('fightercrafts-bay-dogfight-12345'),
    })

    expect(auRemovedDetail).toStrictEqual({
      hornets: 6,
      talons: 6,
      diceResult: 1,
    })
  })

  it('should get au removed detail - fightercrafts-bay.dogfight file 010', () => {
    const auRemovedDetail = GetAURemoved({
      actionName: 'action.fightercrafts-bay.dogfight',
      characterTraits: new Set<Traits>(),
      characterModifier: new Map<ModifiersCharacter, ModifierTracker>(),
      projectsDone: new Set<ProjectNames>([
        'File 010 - M22 "Buzzard" Precision Upgrade',
      ]),
      currentAU: { hornets: 2, talons: 0 },
      prng: seedrandom('fightercrafts-bay-dogfight-1231'),
    })

    expect(auRemovedDetail).toStrictEqual({
      hornets: 2,
      talons: 0,
      diceResult: 3,
    })
  })

  it('should get au removed detail - fightercrafts-bay.dogfight file 011', () => {
    const auRemovedDetail = GetAURemoved({
      actionName: 'action.fightercrafts-bay.dogfight',
      characterTraits: new Set<Traits>(),
      characterModifier: new Map<ModifiersCharacter, ModifierTracker>(),
      projectsDone: new Set<ProjectNames>([
        'File 011 - M22 "Buzzard" Strike Optimization',
      ]),
      currentAU: { hornets: 9, talons: 0 },
      prng: seedrandom('fightercrafts-bay-dogfight-1235'),
    })

    expect(auRemovedDetail).toStrictEqual({
      hornets: 7,
      talons: 0,
      diceResult: 8,
    })
  })

  it('should get au removed detail - random action', () => {
    const auRemovedDetail = GetAURemoved({
      actionName: 'action.medlab.firstaid',
      characterTraits: new Set<Traits>(),
      characterModifier: new Map<ModifiersCharacter, ModifierTracker>(),
      projectsDone: new Set<ProjectNames>(),
      currentAU: { hornets: 2, talons: 0 },
      prng: seedrandom('random-action-12345'),
    })

    expect(auRemovedDetail).toStrictEqual({
      hornets: 0,
      talons: 0,
      diceResult: 0,
    })
  })
})

describe('getRandomizedAUAllocation', () => {
  it.each([
    [{ hornets: 4, talons: 4 }, 9, { hornets: 4, talons: 4 }],
    [{ hornets: 4, talons: 5 }, 9, { hornets: 4, talons: 5 }],
    [{ hornets: 3, talons: 9 }, 9, { hornets: 3, talons: 6 }],
    [{ hornets: 9, talons: 9 }, 9, { hornets: 4, talons: 5 }],
    [{ hornets: 8, talons: 1 }, 9, { hornets: 8, talons: 1 }],
  ])(
    'should randomize considering current hornets and talons amount',
    (currentAU: AerialUnits, auRemoved: number, finalResult: AerialUnits) => {
      const prng = seedrandom('get-randomized-au-allocation')
      const calculated = getRandomizedAUAllocation(currentAU, auRemoved, prng)

      expect(calculated).toStrictEqual(finalResult)
    },
  )
})
