import { INVALID_TARGET_LOCATION } from '@nanosh/messages/errors'
import {
  FRUSTRATED_DEPRIVED_THRESHOLD,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { RoomTypes } from '@nanosh/types/ship'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface GenericShowerParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID'
  > {}

const SHOWER_ROOMS = new Set<RoomTypes>(['private-quarters', 'common-area'])
const SHOWER_AP_USAGE = 1
const SHOWER_AMOROUS_FRUSTRATED_DEPRIVED_REDUCE = 3

export default function ({
  state,
  invokeTime,
  characterID,
}: GenericShowerParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  if (!SHOWER_ROOMS.has(character!.location)) {
    return [null, new Error(INVALID_TARGET_LOCATION)]
  }

  const [apUsed, error] = getAPUsage(
    character!,
    new Set<Skills>(),
    SHOWER_AP_USAGE,
    0,
  )
  if (error !== null) return [null, error]

  if (
    character?.trait.has('trait.amorous') &&
    character.modifiers.has('character.cycle.frustrated') &&
    character.modifiers.has('character.cycle.deprived')
  ) {
    const currentDeprived = character.modifiers.get('character.cycle.deprived')!
    const targetDeprivedAmount =
      currentDeprived!.amount - SHOWER_AMOROUS_FRUSTRATED_DEPRIVED_REDUCE
    character.modifiers.set('character.cycle.deprived', {
      start: { ...currentDeprived!.start },
      expiry: { ...currentDeprived!.expiry },
      amount: Math.max(targetDeprivedAmount, 0),
    })

    if (targetDeprivedAmount < FRUSTRATED_DEPRIVED_THRESHOLD) {
      character.modifiers.delete('character.cycle.frustrated')
    }
  }

  character?.modifiers.delete('character.cycle.dirty')
  character?.cycleActions.set(invokeTime, 'action.generic.shower')
  character!.ap -= apUsed

  return [stateCopy, null]
}
