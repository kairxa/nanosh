import {
  INVALID_MOBILIZE_NOT_ENOUGH_RESOURCES,
  INVALID_MOBILIZE_CONFIRM,
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
import seedrandom from 'seedrandom'
import skillModifiers, { SKILL_AP_REDUCE } from './skillModifiers'

interface BridgeCommandMobilizeParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'gameID' | 'invokeTime'
  > {
  targetSubsectorID: SubsectorNames
}

const MOBILIZE_DEFAULT_AP_USAGE = 2

type PickedSacrifice = 'civitates' | 'supplies' | 'eCells'
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
    gameID,
    invokeTime,
  )[0] as PickedSacrifice
  const civitates = Math.floor(prng() * 10) + 6
  const supplies = Math.floor(prng() * 35) + 33
  const eCells = Math.floor(prng() * 5) + 5
  const savedMobilize = {
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
  const mobilizeData = stateCopy.anyMap.get(mobilizeID)
  if (!mobilizeData) return [null, new Error(INVALID_MOBILIZE_CONFIRM)]

  const pickedSacrifice = stateCopy.ship[
    mobilizeData.pickedSacrifice as PickedSacrifice
  ] as number
  if (pickedSacrifice < mobilizeData[mobilizeData.pickedSacrifice]) {
    return [
      null,
      new Error(
        `${INVALID_MOBILIZE_NOT_ENOUGH_RESOURCES} - Requested: ${mobilizeData.pickedSacrifice} with amount ${mobilizeData[mobilizeData.pickedSacrifice]}`,
      ),
    ]
  }
  // Reduce supplies, civitates, etc
  ;(stateCopy.ship[
    mobilizeData.pickedSacrifice as PickedSacrifice
  ] as number) -= mobilizeData[mobilizeData.pickedSacrifice]
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
