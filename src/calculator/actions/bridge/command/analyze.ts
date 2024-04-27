import {
  INVALID_ANALYZE_NOT_ENOUGH_BASIC_INTEL,
  INVALID_CHARACTER_ID,
} from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import getAPUsage from '@nanosh/utils/getAPUsage'
import skillModifiers, { SKILL_AP_REDUCE } from './skillModifiers'

const ANALYZE_AP_USAGE = 1
const ANALYZE_BASIC_INTEL_USAGE = 7
const ANALYZE_CRIT_INTEL_ADDITION = 1
const ANALYZE_SAVANT_DEPRIVED_REDUCE = 3
const ANALYZE_SAVANT_BASIC_INTEL_REDUCE = 1

interface BridgeCommandAnalyzeParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'invokeTime'
  > {}
export default function ({
  state,
  characterID,
  invokeTime,
}: BridgeCommandAnalyzeParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (stateCopy.intel.basic < ANALYZE_BASIC_INTEL_USAGE) {
    return [null, new Error(INVALID_ANALYZE_NOT_ENOUGH_BASIC_INTEL)]
  }

  const character = stateCopy.characters.get(characterID)
  if (!character) return [null, new Error(INVALID_CHARACTER_ID)]

  const [apUsed, error] = getAPUsage(
    character,
    skillModifiers,
    ANALYZE_AP_USAGE,
    SKILL_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  let basicIntelUsage = ANALYZE_BASIC_INTEL_USAGE
  if (character.skills.has('skill.savant')) {
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
      amount: (currentDeprived?.amount || 0) - ANALYZE_SAVANT_DEPRIVED_REDUCE,
    })
    basicIntelUsage -= ANALYZE_SAVANT_BASIC_INTEL_REDUCE
  }
  stateCopy.intel.basic -= basicIntelUsage
  stateCopy.intel.critical += ANALYZE_CRIT_INTEL_ADDITION
  character.cycleActions.set(invokeTime, 'action.bridge.command.analyze')
  character.ap -= apUsed

  return [stateCopy, null]
}
