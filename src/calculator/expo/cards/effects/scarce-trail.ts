import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import GetRandomNumber from '@nanosh/utils/getRandomNumber'
import seedrandom from 'seedrandom'

interface ScarceTrailParams
  extends Pick<GenericCalculatorParams, 'state' | 'gameID' | 'invokeTime'> {}

const SCARCE_TRAIL_MIN_INTEL_BASIC = 0
const SCARCE_TRAIL_MAX_INTEL_BASIC = 1

export default function ScarceTrail({
  state,
  gameID,
  invokeTime,
}: ScarceTrailParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const intelBasicAdded = GetRandomNumber(
    SCARCE_TRAIL_MIN_INTEL_BASIC,
    SCARCE_TRAIL_MAX_INTEL_BASIC,
    prng,
  )

  stateCopy.intel.basic += intelBasicAdded

  return [stateCopy, null]
}
