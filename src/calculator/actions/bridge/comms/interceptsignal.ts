import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface BridgeCommsInterceptSignalParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID'
  > {}

const INTERCEPTSIGNAL_AP_USAGE = 2
const INTERCEPTSIGNAL_SKILL_MODIFIER: Set<Skills> = new Set<Skills>([
  'skill.comms-savvy',
])
const INTERCEPTSIGNAL_SKILL_MODIFIER_AP_REDUCE = 1
const INTERCEPTSIGNAL_BASIC_INTEL_ADDITION = 1

export default function ({
  state,
  invokeTime,
  characterID,
}: BridgeCommsInterceptSignalParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    INTERCEPTSIGNAL_SKILL_MODIFIER,
    INTERCEPTSIGNAL_AP_USAGE,
    INTERCEPTSIGNAL_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  stateCopy!.intel.basic += INTERCEPTSIGNAL_BASIC_INTEL_ADDITION
  character!.cycleActions.set(invokeTime, 'action.bridge.comms.interceptsignal')
  character!.ap -= apUsed

  return [stateCopy, null]
}
