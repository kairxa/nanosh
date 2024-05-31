import { INVALID_MAX_EXPO_MEMBERS_REACHED } from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface ExpocraftsBayReady
  extends Pick<GenericCalculatorParams, 'state' | 'characterID'> {}

const EXPO_MAX_MEMBERS = 4
const EXPO_READY_AP_USAGE = 1

export default function ({
  state,
  characterID,
}: ExpocraftsBayReady): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (stateCopy.ship.expo.members.size === EXPO_MAX_MEMBERS) {
    return [null, new Error(INVALID_MAX_EXPO_MEMBERS_REACHED)]
  }

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    new Set<Skills>(),
    EXPO_READY_AP_USAGE,
    0,
  )
  if (error !== null) return [null, error]

  stateCopy.ship.expo.members.add(characterID)
  character!.ap -= apUsed

  return [stateCopy, null]
}
