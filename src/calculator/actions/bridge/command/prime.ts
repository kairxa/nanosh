import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import getAPUsage from '@nanosh/utils/getAPUsage'
import skillModifiers, { SKILL_AP_REDUCE } from './skillModifiers'

interface BridgeCommandPrimeParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'invokeTime'
  > {
  start: { day: number; cycle: number }
}

const PRIME_DEFAULT_AP_USAGE = 2

export default function ({
  state,
  characterID,
  start,
  invokeTime = new Date().getTime(),
}: BridgeCommandPrimeParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)

  const [apUsed, error] = getAPUsage(
    character!,
    skillModifiers,
    PRIME_DEFAULT_AP_USAGE,
    SKILL_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  stateCopy.ship.modifiers.set('ship.combat.bridge.command.cannon-primed', {
    start,
    amount: 1,
    expiry: -1,
  })
  character!.cycleActions.set(invokeTime, 'action.bridge.command.prime')
  character!.ap -= apUsed

  return [stateCopy, null]
}
