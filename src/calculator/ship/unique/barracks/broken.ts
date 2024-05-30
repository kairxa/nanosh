import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import GetRandomNumber from '@nanosh/utils/getRandomNumber'
import seedrandom from 'seedrandom'

interface ModifiersShipUniqueBarracksBrokenParams
  extends Pick<GenericCalculatorParams, 'state' | 'gameID' | 'invokeTime'> {}

const MIN_REMOVED = 10
const MAX_REMOVED = 60

export default function ({
  state,
  gameID,
  invokeTime,
}: ModifiersShipUniqueBarracksBrokenParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (stateCopy.ship.praetorians === 0) return [stateCopy, null]

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const removedAmountPercentage =
    GetRandomNumber(MIN_REMOVED, MAX_REMOVED, prng) / 100
  const removedAmount = Math.ceil(
    stateCopy.ship.praetorians * removedAmountPercentage,
  )
  stateCopy.ship.praetorians -= removedAmount

  return [stateCopy, null]
}
