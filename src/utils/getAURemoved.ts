import type { Actions } from '@nanosh/types/actions'
import type { AerialUnits } from '@nanosh/types/game'
import type {
  ModifierTracker,
  ModifiersCharacter,
} from '@nanosh/types/modifiers'
import type { ProjectNames } from '@nanosh/types/projects'
import type { Traits } from '@nanosh/types/traits'
import type seedrandom from 'seedrandom'
import GetRandomNumber from './getRandomNumber'
import { DICE_1D10, DICE_1D6, DICE_2D6 } from './initialState/dice'

const getRandomizedAUAllocation = (
  auRemoved: number,
  prng: seedrandom.PRNG,
): AerialUnits => {
  const hornets = GetRandomNumber(0, auRemoved, prng)
  const talons = auRemoved - hornets
  return { hornets, talons }
}

interface AerialUnitsWithDiceResult extends AerialUnits {
  diceResult: number
}

const FILE_010_DICE_RESULT_TABLE = new Set<number>([2, 3, 4])
const FILE_010_AU_ADD = 1
const FILE_011_DICE_RESULT_TABLE = new Set<number>([7, 8, 9])
const FILE_011_AU_ADD = 1
const FLAK_TURRET_SHOOT_TABLE = [0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4]
const LASER_TURRET_SHOOT_TABLE = [0, 1, 1, 2, 2, 2]
const BUZZARD_BAY_DOGFIGHT_TABLE = [8, 0, 1, 2, 3, 4, 5, 6, 6, 0]
const DICE_ACE_RESULT = 1
const DOGFIGHT_AU_ADD = 1
const DOGFIGHT_AU_ACE_ADD_MIN = 2
const DOGFIGHT_AU_ACE_ADD_MAX = 3

export default function GetAURemoved({
  actionName,
  characterTraits,
  characterModifier,
  projectsDone,
  prng,
}: {
  actionName: Actions
  characterTraits: Set<Traits>
  characterModifier: Map<ModifiersCharacter, ModifierTracker>
  projectsDone: Set<ProjectNames>
  prng: seedrandom.PRNG
}): AerialUnitsWithDiceResult {
  let diceResult: number
  let randomIndex: number
  let baseAURemoved: number = 0
  switch (actionName) {
    case 'action.flak-turret.shoot':
      diceResult = GetRandomNumber(DICE_2D6.min, DICE_2D6.max, prng)
      randomIndex = diceResult - 2 // 2d6 - 2 for zero-based index
      baseAURemoved = FLAK_TURRET_SHOOT_TABLE[randomIndex]
      break
    case 'action.laser-turret.shoot':
      diceResult = GetRandomNumber(DICE_1D6.min, DICE_1D6.max, prng)
      randomIndex = diceResult - 1 // 1d6 - 1 for zero-based index
      baseAURemoved = LASER_TURRET_SHOOT_TABLE[randomIndex]
      break
    case 'action.fightercrafts-bay.dogfight':
      diceResult = GetRandomNumber(DICE_1D10.min, DICE_1D10.max, prng)
      randomIndex = diceResult - 1 // 1d10 - 1 for zero-based index
      baseAURemoved = BUZZARD_BAY_DOGFIGHT_TABLE[randomIndex]

      if (characterTraits.has('trait.ace')) {
        baseAURemoved += DOGFIGHT_AU_ADD

        if (diceResult === DICE_ACE_RESULT) {
          baseAURemoved += GetRandomNumber(
            DOGFIGHT_AU_ACE_ADD_MIN,
            DOGFIGHT_AU_ACE_ADD_MAX,
            prng,
          )
        }
      }

      if (
        projectsDone.has('File 010 - M22 "Buzzard" Precision Upgrade') &&
        FILE_010_DICE_RESULT_TABLE.has(diceResult)
      ) {
        baseAURemoved += FILE_010_AU_ADD
      }

      if (
        projectsDone.has('File 011 - M22 "Buzzard" Strike Optimization') &&
        FILE_011_DICE_RESULT_TABLE.has(diceResult)
      ) {
        baseAURemoved += FILE_011_AU_ADD
      }
      break
    default:
      diceResult = 0
      randomIndex = 0
      baseAURemoved = 0
      break
  }

  if (characterModifier.has('character.persistent.drunk')) {
    const drunkAmount = characterModifier.get(
      'character.persistent.drunk',
    )!.amount
    baseAURemoved = Math.max(baseAURemoved - drunkAmount, 0)
  }

  return {
    ...getRandomizedAUAllocation(baseAURemoved, prng),
    diceResult,
  }
}
