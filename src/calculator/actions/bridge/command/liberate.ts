import {
  FATAL_LIBERATE_REDUCE_ADVANCE_SUBSECTOR_NAME_MISMATCH,
  FATAL_SHIP_LOCATION_STORE_MISMATCH,
  INVALID_LIBERATE_NO_LIBPO,
} from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import {
  type Subsector,
  type SubsectorNames,
  type Supersector,
} from '@nanosh/types/sectors'
import getAPUsage from '@nanosh/utils/getAPUsage'
import { GetRandomSet } from '@nanosh/utils/getRandomArray'
import skillModifiers, { SKILL_AP_REDUCE } from './skillModifiers'

interface BridgeCommandLiberateParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'gameID' | 'characterID' | 'invokeTime'
  > {}

const LIBERATE_AP_USAGE = 2
const LIBERATE_REDUCE_ADVANCE_COUNT = 1

export default function ({
  state,
  gameID,
  characterID,
  invokeTime,
}: BridgeCommandLiberateParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  // Check ship location
  const currentLocation = stateCopy.shipLocation
  const currentSupersector = stateCopy.sectors.get(currentLocation) as
    | Supersector
    | undefined
  if (!currentSupersector)
    return [null, new Error(FATAL_SHIP_LOCATION_STORE_MISMATCH)]

  const subsectorVicinityList = currentSupersector.subsectors

  // Get list of liberation points inside current supersector
  const libPoVicinityList = stateCopy.nanosh.liberationPoints.intersection(
    subsectorVicinityList,
  )
  if (libPoVicinityList.size <= 0)
    return [null, new Error(INVALID_LIBERATE_NO_LIBPO)]

  // Get AP usage
  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    skillModifiers,
    LIBERATE_AP_USAGE,
    SKILL_AP_REDUCE,
  )
  if (error) return [null, error]

  // Get list subsectors that has advances
  const advancesVicinityList = stateCopy.nanosh.advances.intersection(
    subsectorVicinityList,
  )
  const libPoSize = libPoVicinityList.size
  // Get randomized advances that will be removed by liberation points, according to libpo total
  const removedAdvancesVicinityList = GetRandomSet(
    advancesVicinityList,
    libPoSize,
    gameID,
    invokeTime,
  ) as Set<SubsectorNames>

  let removeAdvancesError: Error | null = null
  // Remove advances
  removedAdvancesVicinityList.forEach((subsectorName) => {
    const subsector = stateCopy.sectors.get(subsectorName) as
      | Subsector
      | undefined
    if (!subsector) {
      removeAdvancesError = new Error(
        `${FATAL_LIBERATE_REDUCE_ADVANCE_SUBSECTOR_NAME_MISMATCH}: ${subsectorName}`,
      )
      return
    }

    subsector.hp -= LIBERATE_REDUCE_ADVANCE_COUNT
  })

  if (removeAdvancesError !== null) return [null, removeAdvancesError]

  // Get outposts list in supersector
  const outpostsVicinityList = stateCopy.nanosh.outposts.intersection(
    subsectorVicinityList,
  )

  // If outposts exist then always delete the outposts
  if (outpostsVicinityList.size > 0) {
    const removedOutpostsVicinityList = GetRandomSet(
      outpostsVicinityList,
      libPoSize,
      gameID,
      invokeTime,
    ) as Set<SubsectorNames>
    removedOutpostsVicinityList.forEach((subsectorName) => {
      stateCopy.nanosh.outposts.delete(subsectorName)
      stateCopy.nanosh.destroyed.outposts.add(subsectorName)
      stateCopy.subsectors.empty.add(subsectorName)
      stateCopy.sectors.set(subsectorName, {
        ...(stateCopy.sectors.get(subsectorName) as Subsector),
        hp: 0,
      })
    })
  }

  // Only if outposts doesn't exist and the supersector is an aux base, delete aux base
  if (
    outpostsVicinityList.size <= 0 &&
    stateCopy.nanosh.auxBase.has(currentLocation)
  ) {
    stateCopy.nanosh.auxBase.delete(currentLocation)
    stateCopy.nanosh.destroyed.auxBase.add(currentLocation)
    stateCopy.sectors.set(currentLocation, {
      ...(stateCopy.sectors.get(currentLocation) as Supersector),
      hp: 0,
    })
  }

  // The usual add cycle actions and reduce app. If there is not libpo nor aux base then it's a waste of AP.
  character?.cycleActions.set(invokeTime, 'action.bridge.command.liberate')
  character!.ap -= apUsed

  return [stateCopy, null]
}
