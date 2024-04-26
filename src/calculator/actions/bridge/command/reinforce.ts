import {
  INVALID_REINFORCE_NOT_ENOUGH_RESOURCES,
  INVALID_CHARACTER_ID,
  INVALID_REINFORCE_TARGET,
  INVALID_SHIP_LOCATION,
} from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Subsector, SubsectorNames } from '@nanosh/types/sectors'
import getAPUsage from '@nanosh/utils/getAPUsage'
import skillModifiers, { SKILL_AP_REDUCE } from './skillModifiers'

interface BridgeCommandReinforceParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'invokeTime'
  > {
  resourceType: 'supplies' | 'praetorians'
  targetSubsectorID: SubsectorNames
}

const REINFORCE_AP_USAGE = 2
const REINFORCE_SUPPLIES_USAGE = 40
const REINFORCE_PRAETORIAN_USAGE = 2
const REINFORCE_HP_ADD = 2

export default function ({
  state,
  characterID,
  resourceType,
  targetSubsectorID,
  invokeTime,
}: BridgeCommandReinforceParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  if (!character) return [null, new Error(INVALID_CHARACTER_ID)]

  const targetSubsector = stateCopy.sectors.get(targetSubsectorID) as
    | Subsector
    | undefined
  if (!targetSubsector || !targetSubsector.supersector)
    return [null, new Error(INVALID_REINFORCE_TARGET)]

  if (targetSubsector.supersector !== stateCopy.shipLocation) {
    return [null, new Error(INVALID_SHIP_LOCATION)]
  }

  if (!stateCopy.nanosh.liberationPoints.has(targetSubsectorID)) {
    return [null, new Error(INVALID_REINFORCE_TARGET)]
  }

  const [apUsed, error] = getAPUsage(
    character,
    skillModifiers,
    REINFORCE_AP_USAGE,
    SKILL_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  if (resourceType === 'supplies') {
    if (stateCopy.ship.supplies < REINFORCE_SUPPLIES_USAGE) {
      return [null, new Error(INVALID_REINFORCE_NOT_ENOUGH_RESOURCES)]
    }

    stateCopy.ship.supplies -= REINFORCE_SUPPLIES_USAGE
  }

  if (resourceType === 'praetorians') {
    if (stateCopy.ship.praetorians < REINFORCE_PRAETORIAN_USAGE) {
      return [null, new Error(INVALID_REINFORCE_NOT_ENOUGH_RESOURCES)]
    }

    stateCopy.ship.praetorians -= REINFORCE_PRAETORIAN_USAGE
  }
  stateCopy.sectors.set(targetSubsectorID, {
    ...targetSubsector,
    hp: targetSubsector.hp + REINFORCE_HP_ADD,
  })
  character.cycleActions.set(invokeTime, 'action.bridge.command.reinforce')
  character.ap -= apUsed

  return [stateCopy, null]
}
