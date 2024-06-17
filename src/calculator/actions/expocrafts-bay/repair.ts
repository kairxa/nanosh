import {
  INVALID_EXPOCRAFT_NOTBROKEN_NOTFOUND,
  INVALID_NOT_ENOUGH_SUPPLIES,
} from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import { GetWillDirty } from '@nanosh/utils/getWillDirty'
import seedrandom from 'seedrandom'
import DutifulDeprivedReduce from '../modifiers/traits/dutiful'

interface ExpocraftsBayRepairParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'invokeTime' | 'gameID'
  > {
  expocraftID: number
}

const REPAIR_AP_USAGE = 1
const REPAIR_SKILL_MODIFIERS = new Set<Skills>([
  'skill.adaptable',
  'skill.technician',
])
const REPAIR_SKILL_AP_REDUCE = 1
const REPAIR_SUPPLIES_USAGE_PER_DMG = 20

export default function ({
  state,
  characterID,
  invokeTime,
  gameID,
  expocraftID,
}: ExpocraftsBayRepairParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const expocraft = stateCopy.ship.expoCrafts.get(expocraftID)
  if (!expocraft || expocraft.health >= expocraft.maxHealth) {
    return [null, new Error(INVALID_EXPOCRAFT_NOTBROKEN_NOTFOUND)]
  }

  const healthDiff = expocraft.maxHealth - expocraft.health
  const suppliesUsed = REPAIR_SUPPLIES_USAGE_PER_DMG * healthDiff

  if (stateCopy.ship.supplies < suppliesUsed) {
    return [null, new Error(INVALID_NOT_ENOUGH_SUPPLIES)]
  }

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    REPAIR_SKILL_MODIFIERS,
    REPAIR_AP_USAGE,
    REPAIR_SKILL_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  stateCopy.ship.supplies -= suppliesUsed
  expocraft.health = expocraft.maxHealth
  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const characterWillDirty = GetWillDirty(character!.trait, prng)

  if (characterWillDirty) {
    character?.modifiers.set('character.cycle.dirty', {
      amount: 1,
      start: {
        day: stateCopy.day,
        cycle: stateCopy.cycle,
      },
      expiry: {
        day: -1,
        cycle: -1,
      },
    })
  }
  character!.cycleActions.set(invokeTime, 'action.expocrafts-bay.repair')
  character!.ap -= apUsed

  const [newState, _] = DutifulDeprivedReduce({ state: stateCopy, characterID })
  return [newState, null]
}
