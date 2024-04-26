import {
  INVALID_SUPERSECTOR_TARGET_ID,
  INVALID_NOT_ENOUGH_ECELLS,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import type { GenericCalculatorParams } from '@nanosh/types/generic'
import type { Supersector, SupersectorNames } from '@nanosh/types/sectors'
import getAPUsage from '@nanosh/utils/getAPUsage'
import CalculateDistance from '@nanosh/utils/gridDistance'
import skillModifiers, { SKILL_AP_REDUCE } from './skillModifiers'

interface BridgeCommandAdvanceParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'invokeTime'
  > {
  targetSupersectorID: SupersectorNames
}

const ADVANCE_DEFAULT_AP_USAGE = 2
const BASIC_ECELLS_USAGE = 20

/**
 * action.bridge.command.advance
 * Reduces character AP and ship eCells according to distance
 * 1. Get AP Used amount according to Character skill
 * 2. Get Current Ship Location and CalculateDistance to Target Supersector
 * 3. Reduce Character AP, add Character CycleActions, and reduce Ship eCells
 * @param { GenericCalculatorParams } GenericCalculatorParams
 * @param { Game } GenericCalculatorParams.state
 * @param { string } GenericCalculatorParams.characterID
 * @param { string } GenericCalculatorParams.targetSupersectorID
 */
export default function ({
  state,
  characterID,
  targetSupersectorID,
  invokeTime = new Date().getTime(),
}: BridgeCommandAdvanceParams): [Game | null, Error | null] {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)

  const [apUsed, error] = getAPUsage(
    character!,
    skillModifiers,
    ADVANCE_DEFAULT_AP_USAGE,
    SKILL_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  const targetSupersector = stateCopy.sectors.get(targetSupersectorID)
  // If target supersector is invalid, return Error
  if (!targetSupersector)
    return [null, new Error(INVALID_SUPERSECTOR_TARGET_ID)]

  const eCellsUsed =
    BASIC_ECELLS_USAGE *
    CalculateDistance(
      (state.sectors.get(state.shipLocation) as Supersector).grid,
      (targetSupersector as Supersector).grid,
    )
  // If Ship eCells is not enough, return Error
  if (stateCopy.ship.eCells < eCellsUsed)
    return [null, new Error(INVALID_NOT_ENOUGH_ECELLS)]

  // Reduce Character AP, change Ship Location, add Character CycleActions, and reduce Ship eCells
  stateCopy.ship.eCells -= eCellsUsed
  stateCopy.shipLocation = targetSupersectorID
  character!.cycleActions.set(invokeTime, 'action.bridge.command.advance')
  character!.ap -= apUsed

  return [stateCopy, null]
}
