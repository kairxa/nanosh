import { INVALID_NOT_ENOUGH_ECELLS } from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface EngineRoomShieldParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID'
  > {
  eCellAmount: number
}

const SHIELD_ECELL_CONVERSION = 10
const SHIELD_AP_USAGE = 1

export default function ({
  state,
  invokeTime,
  characterID,
  eCellAmount,
}: EngineRoomShieldParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (stateCopy.ship.eCells < eCellAmount) {
    return [null, new Error(INVALID_NOT_ENOUGH_ECELLS)]
  }

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(character!, new Set(), SHIELD_AP_USAGE, 0)
  if (error !== null) return [null, error]

  const shieldAdd = eCellAmount * SHIELD_ECELL_CONVERSION

  stateCopy.ship.shield = Math.min(shieldAdd, stateCopy.ship.maxShield)
  character?.cycleActions.set(invokeTime, 'action.engine-room.shield')
  character!.ap -= apUsed

  return [stateCopy, null]
}
