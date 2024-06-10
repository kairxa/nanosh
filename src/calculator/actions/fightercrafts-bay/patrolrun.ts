import {
  INVALID_FIGHTERCRAFT_BROKEN_NOTFOUND,
  INVALID_NOT_ENOUGH_ECELLS,
  INVALID_TARGET_LOCATION,
} from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { SubsectorNames, Supersector } from '@nanosh/types/sectors'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface FightercraftsBayPatrolunParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID'
  > {
  fightercraftID: number
  subsectorName: SubsectorNames
}

const PATROLRUN_AP_USAGE = 2
const PATROLRUN_ECELLS_USAGE = 2
const PATROLRUN_SKILLS_MODIFIER = new Set<Skills>(['skill.aviator'])
const PATROLRUN_SKILL_AP_REDUCE = 1

export default function ({
  state,
  invokeTime,
  characterID,
  fightercraftID,
  subsectorName,
}: FightercraftsBayPatrolunParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const currentSupersector = stateCopy.shipLocation
  const listSubsectors = (
    stateCopy.sectors.get(currentSupersector) as Supersector
  ).subsectors
  if (!listSubsectors.has(subsectorName)) {
    return [null, new Error(INVALID_TARGET_LOCATION)]
  }

  const selectedFightercraft = stateCopy.ship.fighterCrafts.get(fightercraftID)
  if (!selectedFightercraft || selectedFightercraft.broken) {
    return [null, new Error(INVALID_FIGHTERCRAFT_BROKEN_NOTFOUND)]
  }

  if (stateCopy.ship.eCells < PATROLRUN_ECELLS_USAGE) {
    return [null, new Error(INVALID_NOT_ENOUGH_ECELLS)]
  }

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    PATROLRUN_SKILLS_MODIFIER,
    PATROLRUN_AP_USAGE,
    PATROLRUN_SKILL_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  stateCopy.ship.eCells -= PATROLRUN_ECELLS_USAGE
  if (stateCopy.nanosh.advances.has(subsectorName)) {
    stateCopy.nanosh.advances.delete(subsectorName)
    stateCopy.sectors.get(subsectorName)!.hp = 0
    stateCopy.subsectors.empty.add(subsectorName)
  }
  character?.cycleActions.set(invokeTime, 'action.fightercrafts-bay.patrolrun')
  character!.ap -= apUsed

  return [stateCopy, null]
}
