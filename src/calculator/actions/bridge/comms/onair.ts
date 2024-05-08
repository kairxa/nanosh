import {
  MAX_CYCLE_PER_DAY,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import dutifulDeprivedReduce from '../../modifiers/traits/dutiful'

interface BridgeCommsOnairParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID'
  > {}

const ONAIR_AP_USAGE = 2
const ONAIR_SKILL_MODIFIER: Set<Skills> = new Set<Skills>(['skill.comms-savvy'])
const ONAIR_SKILL_MODIFIER_AP_REDUCE = 1

export default function ({
  state,
  invokeTime,
  characterID,
}: BridgeCommsOnairParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    ONAIR_SKILL_MODIFIER,
    ONAIR_AP_USAGE,
    ONAIR_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  stateCopy.ship.modifiers.set('ship.day-change.bridge.comms.onair', {
    amount: 1,
    start: {
      day: stateCopy.day,
      cycle: stateCopy.cycle,
    },
    expiry: {
      day: stateCopy.day,
      cycle: MAX_CYCLE_PER_DAY,
    },
  })

  character!.cycleActions.set(invokeTime, 'action.bridge.comms.onair')
  character!.ap -= apUsed
  const [newState, _] = dutifulDeprivedReduce({ state: stateCopy, characterID })

  return [newState, null]
}
