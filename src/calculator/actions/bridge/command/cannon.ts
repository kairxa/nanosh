import {
  INVALID_SHIP_LOCATION,
  INVALID_TARGET_NOT_NANOSH,
} from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type {
  SectorNames,
  Subsector,
  SubsectorNames,
  SupersectorNames,
} from '@nanosh/types/sectors'
import getAPUsage from '@nanosh/utils/getAPUsage'
import seedrandom from 'seedrandom'
import skillModifiers, { SKILL_AP_REDUCE } from './skillModifiers'

interface BridgeCommandCannonParams
  extends Pick<
    GenericCalculatorParams,
    'gameID' | 'state' | 'characterID' | 'invokeTime'
  > {
  targetID: SectorNames
}

const CANNON_DEFAULT_AP_USAGE = 2
const CANNON_DEFAULT_ECELLS_USAGE = 10
const MODIFIER_ENGINE_OPTIMIZED_ECELLS_USAGE_MULTIPLIER = 0.5

export default function ({
  gameID,
  state,
  characterID,
  invokeTime,
  targetID,
}: BridgeCommandCannonParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  // If it's an invalid ID, or not mainBase, not auxBase, and not outpost, return INVALID_CANNON_TARGET
  const isMainBase = stateCopy.nanosh.mainBase === targetID
  const isAuxBase = stateCopy.nanosh.auxBase.has(targetID as SupersectorNames)
  const isOutpost = stateCopy.nanosh.outposts.has(targetID as SubsectorNames)

  if (!isMainBase && !isAuxBase && !isOutpost) {
    return [null, new Error(INVALID_TARGET_NOT_NANOSH)]
  }

  const shipLocation = stateCopy.shipLocation
  const targetSupersectorID = (
    stateCopy.sectors.get(targetID as SubsectorNames) as Subsector
  ).supersector
  // If ship is not inside supersector location, return INVALID_SHIP_LOCATION
  if (shipLocation !== targetID && shipLocation !== targetSupersectorID) {
    return [null, new Error(INVALID_SHIP_LOCATION)]
  }

  const character = stateCopy.characters.get(characterID)

  let apUsed: number
  let error: Error | null
    // Ensuring character has enough AP to do the action anyway. Very annoying hehe.
  ;[apUsed, error] = getAPUsage(
    character!,
    skillModifiers,
    CANNON_DEFAULT_AP_USAGE,
    SKILL_AP_REDUCE,
  )
  if (error !== null) return [null, error]
  let eCellsUsage = CANNON_DEFAULT_ECELLS_USAGE
  // If engine is optimized, reduce AP usage by multiplier value
  if (stateCopy.ship.modifiers.has('ship.persistent.engine.optimized')) {
    eCellsUsage = Math.ceil(
      eCellsUsage * MODIFIER_ENGINE_OPTIMIZED_ECELLS_USAGE_MULTIPLIER,
    )
  }

  // If cannon-primed, reduce eCellsUsage and ap usage to 0
  if (
    stateCopy.ship.modifiers.has('ship.combat.bridge.command.cannon-primed')
  ) {
    eCellsUsage = 0
    apUsed = 0
  }

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const damage = Math.floor(prng() * 4) + 5

  const sectorTarget = stateCopy.sectors.get(targetID)! // all guards have been written above.

  sectorTarget.hp = Math.max(sectorTarget.hp - damage, 0)
  // If it's a final damage, then remove target from either mainBase, auxBase, or outposts
  if (sectorTarget.hp === 0) {
    if (isMainBase) stateCopy.nanosh.mainBase = null
    if (isAuxBase) stateCopy.nanosh.auxBase.delete(targetID as SupersectorNames)
    if (isOutpost) {
      stateCopy.nanosh.outposts.delete(targetID as SubsectorNames)
      stateCopy.subsectors.empty.add(targetID as SubsectorNames)
    }
  }
  stateCopy.ship.eCells -= eCellsUsage
  stateCopy.ship.modifiers.delete('ship.combat.bridge.command.cannon-primed')
  character!.cycleActions.set(invokeTime, 'action.bridge.command.cannon')
  character!.ap -= apUsed

  return [stateCopy, null]
}
