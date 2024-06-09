import {
  INVALID_MOBILIZE_CONFIRM,
  INVALID_MOBILIZE_NOT_ENOUGH_RESOURCES,
  INVALID_MOBILIZE_TARGET,
  INVALID_SHIP_LOCATION,
} from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Subsector, SubsectorNames } from '@nanosh/types/sectors'
import getAPUsage from '@nanosh/utils/getAPUsage'
import { GetRandomArray } from '@nanosh/utils/getRandomArray'
import GetRandomNumber from '@nanosh/utils/getRandomNumber'
import seedrandom from 'seedrandom'
import skillModifiers, { SKILL_AP_REDUCE } from './skillModifiers'

type PickedSacrifice = 'civitates' | 'supplies' | 'eCells'

interface BridgeCommandMobilizeParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'gameID' | 'invokeTime'
  > {
  targetSubsectorID: SubsectorNames
}

interface SavedMobilize {
  pickedSacrifice: PickedSacrifice
  civitates: number
  supplies: number
  eCells: number
  targetSubsectorID: SubsectorNames
}

const MOBILIZE_DEFAULT_AP_USAGE = 2
const MOBILIZE_MIN_CIVITATES = 6
const MOBILIZE_MAX_CIVITATES = 15
const MOBILIZE_MIN_SUPPLIES = 33
const MOBILIZE_MAX_SUPPLIES = 67
const MOBILIZE_MIN_ECELLS = 5
const MOBILIZE_MAX_ECELLS = 9
const collectionPickedSacrifices: PickedSacrifice[] = [
  'civitates',
  'supplies',
  'eCells',
]

export default function mobilize({
  state,
  gameID,
  invokeTime,
  characterID,
  targetSubsectorID,
}: BridgeCommandMobilizeParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (
    (stateCopy.sectors.get(targetSubsectorID) as Subsector).supersector !==
    stateCopy.shipLocation
  ) {
    return [null, new Error(INVALID_SHIP_LOCATION)]
  }

  if (!stateCopy.subsectors.empty.has(targetSubsectorID)) {
    return [null, new Error(INVALID_MOBILIZE_TARGET)]
  }

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    skillModifiers,
    MOBILIZE_DEFAULT_AP_USAGE,
    SKILL_AP_REDUCE,
  )
  if (error !== null) {
    return [null, error]
  }

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const pickedSacrifice = GetRandomArray(
    collectionPickedSacrifices,
    1,
    prng,
  )[0] as PickedSacrifice
  const civitates = GetRandomNumber(
    MOBILIZE_MIN_CIVITATES,
    MOBILIZE_MAX_CIVITATES,
    prng,
  )
  const supplies = GetRandomNumber(
    MOBILIZE_MIN_SUPPLIES,
    MOBILIZE_MAX_SUPPLIES,
    prng,
  )
  const eCells = GetRandomNumber(MOBILIZE_MIN_ECELLS, MOBILIZE_MAX_ECELLS, prng)
  const savedMobilize: SavedMobilize = {
    pickedSacrifice,
    civitates,
    supplies,
    eCells,
    targetSubsectorID,
  }

  if (stateCopy.ship[pickedSacrifice] < savedMobilize[pickedSacrifice]) {
    return [
      null,
      new Error(
        `${INVALID_MOBILIZE_NOT_ENOUGH_RESOURCES} - Requested: ${pickedSacrifice} with amount ${savedMobilize[pickedSacrifice]}`,
      ),
    ]
  }

  stateCopy.anyMap.set(`${gameID}-${characterID}-mobilize`, {
    pickedSacrifice,
    civitates,
    supplies,
    eCells,
    targetSubsectorID,
  })
  character?.cycleActions.set(invokeTime, 'action.bridge.command.mobilize')
  character!.ap -= apUsed

  return [stateCopy, null]
}

interface BridgeCommandMobilizeConfirmParams
  extends Pick<GenericCalculatorParams, 'state' | 'characterID' | 'gameID'> {}
export function mobilizeConfirm({
  state,
  characterID,
  gameID,
}: BridgeCommandMobilizeConfirmParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const mobilizeID = `${gameID}-${characterID}-mobilize`
  const mobilizeData = stateCopy.anyMap.get(mobilizeID) as SavedMobilize
  if (!mobilizeData) return [null, new Error(INVALID_MOBILIZE_CONFIRM)]

  const pickedSacrifice = stateCopy.ship[mobilizeData.pickedSacrifice]
  if (pickedSacrifice < mobilizeData[mobilizeData.pickedSacrifice]) {
    return [
      null,
      new Error(
        `${INVALID_MOBILIZE_NOT_ENOUGH_RESOURCES} - Requested: ${mobilizeData.pickedSacrifice} with amount ${mobilizeData[mobilizeData.pickedSacrifice]}`,
      ),
    ]
  }
  // Reduce supplies, civitates, etc
  stateCopy.ship[mobilizeData.pickedSacrifice] -=
    mobilizeData[mobilizeData.pickedSacrifice]
  // Make targetSubsectorID as liberation point
  stateCopy.nanosh.liberationPoints.add(mobilizeData.targetSubsectorID)
  stateCopy.subsectors.empty.delete(mobilizeData.targetSubsectorID)
  stateCopy.sectors.get(mobilizeData.targetSubsectorID)!.hp = 3
  stateCopy.anyMap.delete(mobilizeID)

  return [stateCopy, null]
}

export function mobilizeRefuse({
  state,
  characterID,
  gameID,
}: BridgeCommandMobilizeConfirmParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const mobilizeID = `${gameID}-${characterID}-mobilize`
  const mobilizeData = stateCopy.anyMap.get(mobilizeID)
  if (!mobilizeData) return [null, new Error(INVALID_MOBILIZE_CONFIRM)]
  stateCopy.anyMap.delete(mobilizeID)

  return [stateCopy, null]
}
