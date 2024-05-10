import {
  INVALID_FIRSTAID_TARGET_NOT_IN_MEDLAB,
  INVALID_FIRSTAID_TARGET_NOT_WOUNDED,
  INVALID_NOT_ENOUGH_SUPPLIES,
} from '@nanosh/messages/errors'
import type { CharacterNames } from '@nanosh/types/character'
import {
  MAX_CYCLE_PER_DAY,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface MedlabFirstaidParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'invokeTime'
  > {
  targetID: CharacterNames
}

const FIRSTAID_AP_USAGE = 2
const FIRSTAID_SKILL_MODIFIERS = new Set<Skills>([
  'skill.physician',
  'skill.adaptable',
])
const FIRSTAID_SKILL_MODIFIERS_AP_REDUCE = 1
const FIRSTAID_LW_REDUCE = 1
const FIRSTAID_PHYSICIAN_LW_REDUCE_EXTRA = 1
const FIRSTAID_SUPPLIES_USAGE = 2

export default function ({
  state,
  characterID,
  invokeTime,
  targetID,
}: MedlabFirstaidParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (stateCopy.ship.supplies < FIRSTAID_SUPPLIES_USAGE) {
    return [null, new Error(INVALID_NOT_ENOUGH_SUPPLIES)]
  }

  const character = stateCopy.characters.get(characterID)
  const target = stateCopy.characters.get(targetID)
  if (
    character?.location !== 'medlab' ||
    character?.location !== target?.location
  ) {
    return [null, new Error(INVALID_FIRSTAID_TARGET_NOT_IN_MEDLAB)]
  }

  const targetLightWound = target.modifiers.get('character.wound.light')
  if (!targetLightWound) {
    return [null, new Error(INVALID_FIRSTAID_TARGET_NOT_WOUNDED)]
  }

  const [apUsed, error] = getAPUsage(
    character!,
    FIRSTAID_SKILL_MODIFIERS,
    FIRSTAID_AP_USAGE,
    FIRSTAID_SKILL_MODIFIERS_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  let woundLightReduce = FIRSTAID_LW_REDUCE

  if (character.skills.has('skill.physician')) {
    woundLightReduce += FIRSTAID_PHYSICIAN_LW_REDUCE_EXTRA
  }

  let targetStabilizedLightWound = target.modifiers.get(
    'character.wound.stabilized.light',
  )
  if (!targetStabilizedLightWound) {
    target.modifiers.set('character.wound.stabilized.light', {
      start: {
        day: stateCopy.day,
        cycle: stateCopy.cycle,
      },
      expiry: {
        day: stateCopy.day,
        cycle: MAX_CYCLE_PER_DAY,
      },
      amount: 0,
    })
    targetStabilizedLightWound = target.modifiers.get(
      'character.wound.stabilized.light',
    )!
  }
  targetStabilizedLightWound.expiry.cycle = MAX_CYCLE_PER_DAY
  targetStabilizedLightWound.amount += Math.min(
    targetLightWound.amount,
    woundLightReduce,
  )
  targetLightWound.amount = Math.max(
    targetLightWound.amount - woundLightReduce,
    0,
  )

  stateCopy.ship.supplies -= FIRSTAID_SUPPLIES_USAGE
  character!.cycleActions.set(invokeTime, 'action.medlab.firstaid')
  character!.ap -= apUsed

  return [stateCopy, null]
}
