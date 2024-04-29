import {
  MAX_CYCLE_PER_DAY,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { ModifiersShip } from '@nanosh/types/modifiers'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface BridgeGardenGrowParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'invokeTime'
  > {}

const GROW_AP_USAGE = 2
const GROW_SKILL_MODIFIER = new Set<Skills>(['skill.botanist'])
const GROW_SKILL_MODIFIER_AP_REDUCE = 1
const GROW_RESOURCE_TAKEN = 4
const GROW_MODIFIER_RESULT: ModifiersShip = 'ship.day-change.garden.grow'

export default function ({
  state,
  characterID,
  invokeTime,
}: BridgeGardenGrowParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    GROW_SKILL_MODIFIER,
    GROW_AP_USAGE,
    GROW_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  stateCopy.ship.modifiers.set(GROW_MODIFIER_RESULT, {
    amount: 1,
    start: { day: stateCopy.day, cycle: stateCopy.cycle },
    expiry: { day: stateCopy.day, cycle: MAX_CYCLE_PER_DAY },
  })
  stateCopy.ship.supplies -= GROW_RESOURCE_TAKEN
  character?.cycleActions.set(invokeTime, 'action.bridge.garden.grow')
  character!.ap -= apUsed

  return [stateCopy, null]
}
