import { INVALID_NOT_ENOUGH_ECELLS } from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import GetAURemoved from '@nanosh/utils/getAURemoved'
import seedrandom from 'seedrandom'

interface LaserTurretShootParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'gameID' | 'characterID' | 'invokeTime'
  > {}

const SHOOT_AP_USAGE = 1
const SHOOT_ECELLS_USAGE = 2
const SHOOT_ECELLS_WEAPON_OPTIMIZED_MULTIPLIER = 0.5

export default function ({
  state,
  gameID,
  characterID,
  invokeTime,
}: LaserTurretShootParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  let eCellsUsage = SHOOT_ECELLS_USAGE
  if (stateCopy.ship.modifiers.has('ship.persistent.weapon.optimized')) {
    eCellsUsage *= SHOOT_ECELLS_WEAPON_OPTIMIZED_MULTIPLIER
  }

  if (stateCopy.ship.eCells < eCellsUsage) {
    return [null, new Error(INVALID_NOT_ENOUGH_ECELLS)]
  }

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    new Set<Skills>(),
    SHOOT_AP_USAGE,
    0,
  )
  if (error !== null) return [null, error]

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const auRemoved = GetAURemoved({
    actionName: 'action.laser-turret.shoot',
    characterModifier: character!.modifiers,
    characterTraits: character!.trait,
    projectsDone: stateCopy.ship.projects.done,
    currentAU: stateCopy.nanosh.aerialUnits,
    prng,
  })

  stateCopy.ship.eCells -= eCellsUsage
  stateCopy.nanosh.aerialUnits.hornets = Math.max(
    stateCopy.nanosh.aerialUnits.hornets - auRemoved.hornets,
    0,
  )
  stateCopy.nanosh.aerialUnits.talons = Math.max(
    stateCopy.nanosh.aerialUnits.talons - auRemoved.talons,
    0,
  )
  character?.cycleActions.set(invokeTime, 'action.laser-turret.shoot')
  character!.ap -= apUsed

  return [stateCopy, null]
}
