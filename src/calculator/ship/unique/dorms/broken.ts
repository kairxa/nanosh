import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import GetRandomNumber from '@nanosh/utils/getRandomNumber'
import seedrandom from 'seedrandom'

interface ModifiersShipUniqueDormsBrokenParams
  extends Pick<GenericCalculatorParams, 'state' | 'gameID' | 'invokeTime'> {}

const MIN_REMOVED = 10
const MAX_REMOVED = 60

export default function ({
  state,
  gameID,
  invokeTime,
}: ModifiersShipUniqueDormsBrokenParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (stateCopy.ship.civitates === 0) return [stateCopy, null]

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const removedAmountPercentage =
    GetRandomNumber(MIN_REMOVED, MAX_REMOVED, prng) / 100
  const removedAmount = Math.ceil(
    stateCopy.ship.civitates * removedAmountPercentage,
  )
  stateCopy.ship.civitates -= removedAmount

  return [stateCopy, null]
}
