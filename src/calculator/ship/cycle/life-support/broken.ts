import type { CharacterNames } from '@nanosh/types/character'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import { GetRandomArray } from '@nanosh/utils/getRandomArray'
import seedrandom from 'seedrandom'

interface ModifiersShipCycleLifeSupportBrokenParams
  extends Pick<GenericCalculatorParams, 'state' | 'gameID' | 'invokeTime'> {}

const CIVITATES_PRAETORIANS_REDUCTION_PERCENTAGE = 10 / 100

const getReducedAmount = (currentAmount: number): number => {
  return Math.ceil(currentAmount * CIVITATES_PRAETORIANS_REDUCTION_PERCENTAGE)
}

export default function ({
  state,
  gameID,
  invokeTime,
}: ModifiersShipCycleLifeSupportBrokenParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const currentCivitates = stateCopy.ship.civitates
  if (currentCivitates > 0) {
    stateCopy.ship.civitates -= getReducedAmount(currentCivitates)
    return [stateCopy, null]
  }

  const currentPraetorians = stateCopy.ship.praetorians
  if (currentPraetorians > 0) {
    stateCopy.ship.praetorians -= getReducedAmount(currentPraetorians)
    return [stateCopy, null]
  }

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const characterPool = Array.from(stateCopy.characters.keys())
  const deadCharacterWalkingName = GetRandomArray(
    characterPool,
    1,
    prng,
  )[0] as CharacterNames
  stateCopy.characters.delete(deadCharacterWalkingName)
  stateCopy.charactersDead.add(deadCharacterWalkingName)

  return [stateCopy, null]
}
