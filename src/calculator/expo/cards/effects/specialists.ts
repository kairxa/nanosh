import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import GetRandomNumber from '@nanosh/utils/getRandomNumber'
import seedrandom from 'seedrandom'

interface SpecialistsParams
  extends Pick<GenericCalculatorParams, 'state' | 'gameID' | 'invokeTime'> {}

const SPECIALISTS_MIN_CIVITATES = 1
const SPECIALISTS_MAX_CIVITATES = 2

export default function Specialists({
  state,
  gameID,
  invokeTime,
}: SpecialistsParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const civitatesAdded = GetRandomNumber(
    SPECIALISTS_MIN_CIVITATES,
    SPECIALISTS_MAX_CIVITATES,
    prng,
  )

  stateCopy.ship.civitates += civitatesAdded

  return [stateCopy, null]
}
