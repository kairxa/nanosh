import {
  MAX_CYCLE_PER_DAY,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { ModifiersShip } from '@nanosh/types/modifiers'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface BridgeCommsRallyParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID'
  > {}

const RALLY_AP_USAGE = 2
const RALLY_SKILL_MODIFIER: Set<Skills> = new Set<Skills>()
const RALLY_SKILL_MODIFIER_AP_REDUCE = 0
const RALLY_SHIP_MODIFIER_ADD: ModifiersShip = 'ship.day-change.general.rallied'

export default function ({
  state,
  invokeTime,
  characterID,
}: BridgeCommsRallyParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    RALLY_SKILL_MODIFIER,
    RALLY_AP_USAGE,
    RALLY_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  stateCopy.ship.modifiers.set(RALLY_SHIP_MODIFIER_ADD, {
    start: {
      day: stateCopy.day,
      cycle: stateCopy.cycle,
    },
    expiry: {
      day: stateCopy.day,
      cycle: MAX_CYCLE_PER_DAY,
    },
    amount: 1,
  })
  character!.cycleActions.set(invokeTime, 'action.bridge.comms.rally')
  character!.ap -= apUsed

  return [stateCopy, null]
}
