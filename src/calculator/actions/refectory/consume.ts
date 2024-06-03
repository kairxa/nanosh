import { INVALID_NOT_ENOUGH_RATIONS } from '@nanosh/messages/errors'
import {
  MAX_CYCLE_PER_DAY,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface RefectoryMealParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID'
  > {}

const MEAL_AP_USAGE = 1
const MEAL_AP_ADD = 1
const MEAL_RATION_REDUCE = 1

export default function ({
  state,
  invokeTime,
  characterID,
}: RefectoryMealParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (stateCopy.ship.rations < MEAL_RATION_REDUCE) {
    return [null, new Error(INVALID_NOT_ENOUGH_RATIONS)]
  }

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    new Set<Skills>(),
    MEAL_AP_USAGE,
    0,
  )
  if (error) return [null, error]

  stateCopy.ship.rations -= MEAL_RATION_REDUCE
  character?.modifiers.delete('character.cycle.hungry')
  character?.modifiers.set('character.day-change.eat', {
    start: { day: stateCopy.day, cycle: stateCopy.cycle },
    expiry: { day: stateCopy.day, cycle: MAX_CYCLE_PER_DAY },
    amount: 1,
  })
  character?.cycleActions.set(invokeTime, 'action.refectory.consume')
  character!.ap -= apUsed
  character!.ap += MEAL_AP_ADD

  return [stateCopy, null]
}
