import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface CommonAreaSocializeParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'invokeTime'
  > {}
const SOCIALIZE_AP_USAGE = 1
const SOCIALIZE_SKILL_MODIFIERS = new Set<Skills>(['skill.silver'])
const SOCIALIZE_SKILL_MODIFIERS_AP_REDUCE = 1
const SOCIALIZE_MORALE_ADDITION = 1
const SOCIALIZE_DEPRIVED_REDUCE = 2
const SOCIALIZE_SILVER_MORALE_ADDITION = 1
const SOCIALIZE_SILVER_DEPRIVED_REDUCE = 2
const SOCIALIZE_DIRTY_MORALE_PENALTY = 1

export default function ({
  state,
  characterID,
  invokeTime,
}: CommonAreaSocializeParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    SOCIALIZE_SKILL_MODIFIERS,
    SOCIALIZE_AP_USAGE,
    SOCIALIZE_SKILL_MODIFIERS_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  let moraleAdd = SOCIALIZE_MORALE_ADDITION
  let deprivedReduce = SOCIALIZE_DEPRIVED_REDUCE
  if (character?.skills.has('skill.silver')) {
    moraleAdd += SOCIALIZE_SILVER_MORALE_ADDITION
    deprivedReduce += SOCIALIZE_SILVER_DEPRIVED_REDUCE
  }
  if (character?.modifiers.has('character.cycle.dirty')) {
    moraleAdd -= SOCIALIZE_DIRTY_MORALE_PENALTY
  }

  const currentDeprived = character!.modifiers.get(
    'character.cycle.deprived',
  ) || {
    start: {
      day: stateCopy.day,
      cycle: stateCopy.cycle,
    },
    expiry: {
      day: -1,
      cycle: -1,
    },
    amount: 0,
  }
  character!.modifiers.set('character.cycle.deprived', {
    start: { ...currentDeprived.start },
    expiry: { ...currentDeprived.expiry },
    amount: Math.max(currentDeprived.amount - deprivedReduce, 0),
  })

  stateCopy.morale = Math.min(stateCopy.morale + moraleAdd, stateCopy.maxMorale)
  character!.cycleActions.set(invokeTime, 'action.common-area.socialize')
  character!.ap -= apUsed

  return [stateCopy, null]
}
