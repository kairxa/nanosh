import {
  MAX_CYCLE_PER_DAY,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface BridgeCommsOnairParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID'
  > {}

const ONAIR_AP_USAGE = 2
const ONAIR_SKILL_MODIFIER: Set<Skills> = new Set<Skills>(['skill.comms-savvy'])
const ONAIR_SKILL_MODIFIER_AP_REDUCE = 1
const ONAIR_DEPRIVED_REDUCE = 1

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
  if (character?.trait.has('trait.dutiful')) {
    const currentDeprived = character.modifiers.get('character.cycle.deprived')
    character.modifiers.set('character.cycle.deprived', {
      start: {
        day: currentDeprived?.start.day || 1,
        cycle: currentDeprived?.start.cycle || 1,
      },
      expiry: {
        day: currentDeprived?.expiry.day || -1,
        cycle: currentDeprived?.expiry.cycle || -1,
      },
      amount: (currentDeprived?.amount || 0) - ONAIR_DEPRIVED_REDUCE,
    })
  }
  character!.cycleActions.set(invokeTime, 'action.bridge.comms.onair')
  character!.ap -= apUsed

  return [stateCopy, null]
}
