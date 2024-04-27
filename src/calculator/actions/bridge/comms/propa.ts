import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface BridgeCommsPropaParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID'
  > {}

const PROPA_AP_USAGE = 3
const PROPA_NANOSH_SYMPATHY_REDUCE = 1
const PROPA_SKILL_MODIFIER: Set<Skills> = new Set<Skills>(['skill.persuasion'])
const PROPA_SKILL_MODIFIER_AP_REDUCE = 1

export default function ({
  state,
  invokeTime,
  characterID,
}: BridgeCommsPropaParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    PROPA_SKILL_MODIFIER,
    PROPA_AP_USAGE,
    PROPA_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  stateCopy.nanoshSympathy = Math.max(
    stateCopy.nanoshSympathy - PROPA_NANOSH_SYMPATHY_REDUCE,
    0,
  )
  character!.cycleActions.set(invokeTime, 'action.bridge.comms.propa')
  character!.ap -= apUsed

  return [stateCopy, null]
}
