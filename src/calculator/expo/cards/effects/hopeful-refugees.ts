import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import GetRandomNumber from '@nanosh/utils/getRandomNumber'
import seedrandom from 'seedrandom'

interface HopefulRefugeesParams
  extends Pick<GenericCalculatorParams, 'state' | 'gameID' | 'invokeTime'> {}

const HOPEFUL_REFUGEES_MIN_CIVITATES = 3
const HOPEFUL_REFUGEES_MAX_CIVITATES = 6

export default function HopefulRefugees({
  state,
  gameID,
  invokeTime,
}: HopefulRefugeesParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const civitatesAdded = GetRandomNumber(
    HOPEFUL_REFUGEES_MIN_CIVITATES,
    HOPEFUL_REFUGEES_MAX_CIVITATES,
    prng,
  )

  stateCopy.ship.civitates += civitatesAdded

  return [stateCopy, null]
}
