import { INVALID_EXPO_CHARACTER_IS_NOT_READY } from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'

interface ExpocraftsBayUnready
  extends Pick<GenericCalculatorParams, 'state' | 'characterID'> {}

const EXPO_READY_AP_USAGE = 1

export default function ({
  state,
  characterID,
}: ExpocraftsBayUnready): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (!stateCopy.ship.expo.members.has(characterID)) {
    return [null, new Error(INVALID_EXPO_CHARACTER_IS_NOT_READY)]
  }

  const character = stateCopy.characters.get(characterID)
  stateCopy.ship.expo.members.delete(characterID)
  character!.ap += EXPO_READY_AP_USAGE

  return [stateCopy, null]
}
