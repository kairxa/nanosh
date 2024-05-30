import { FATAL_SHIP_LOCATION_STORE_MISMATCH } from '@nanosh/messages/errors'
import {
  ITEM_ID_LENGTH,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Supersector } from '@nanosh/types/sectors'
import type { Skills } from '@nanosh/types/skills'
import type { TraderShow, TraderShowItem } from '@nanosh/types/trader'
import getAPUsage from '@nanosh/utils/getAPUsage'
import GetRandomNumber from '@nanosh/utils/getRandomNumber'
import GetRandomString from '@nanosh/utils/getRandomString'
import { Traders } from '@nanosh/utils/initialState/traders'
import seedrandom from 'seedrandom'

interface BridgeCommsHailCalculateParams
  extends Pick<GenericCalculatorParams, 'state' | 'gameID'> {}

interface BridgeCommsHailAcceptParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID' | 'gameID'
  > {}

const HAIL_AP_USAGE = 0
const HAIL_SKILL_MODIFIER: Set<Skills> = new Set<Skills>()
const HAIL_SKILL_MODIFIER_AP_REDUCE = 0
const HAIL_LIBPO_PERCENTAGE_ADDITION = 15 // 15% per libpo

export function hailCalculate({
  state,
  gameID,
}: BridgeCommsHailCalculateParams): [TraderShow, Error | null] {
  const traderResult: TraderShow = {
    name: '',
    taken: { resource: 'supplies', amount: 0 },
    given: { resource: 'supplies', amount: 0 },
    items: new Set<TraderShowItem>(),
  }

  const tradersVicinity = Traders.get(state.shipLocation)
  if (!tradersVicinity)
    return [traderResult, new Error(FATAL_SHIP_LOCATION_STORE_MISMATCH)]

  const libPoVicinityTotal = (
    state.sectors.get(state.shipLocation) as Supersector
  ).subsectors.intersection(state.nanosh.liberationPoints).size
  const tradeMultiplier = libPoVicinityTotal * HAIL_LIBPO_PERCENTAGE_ADDITION

  const prng = seedrandom(`${gameID}-day-${state.day}`)
  const chosenTraderIdx = GetRandomNumber(0, 1, prng)
  const chosenTrader = tradersVicinity[chosenTraderIdx]
  let givenAmount = GetRandomNumber(
    chosenTrader.minGiven,
    chosenTrader.maxGiven,
    prng,
  )
  givenAmount = givenAmount + Math.floor((givenAmount * tradeMultiplier) / 100)

  const takenAmount = GetRandomNumber(
    chosenTrader.minTaken,
    chosenTrader.maxTaken,
    prng,
  )

  let items: Set<TraderShowItem> = new Set<TraderShowItem>()
  if (chosenTrader.items) {
    chosenTrader.items.forEach((item) => {
      let itemGivenAmount = GetRandomNumber(item.minGiven, item.maxGiven, prng)
      itemGivenAmount =
        itemGivenAmount + Math.floor((itemGivenAmount * tradeMultiplier) / 100)

      items.add({
        itemName: item.itemName,
        given: itemGivenAmount,
      })
    })
  }

  const traderShow: TraderShow = {
    given: {
      amount: givenAmount,
      resource: chosenTrader.given,
    },
    taken: {
      amount: takenAmount,
      resource: chosenTrader.taken,
    },
    name: chosenTrader.name,
    items,
  }

  return [traderShow, null]
}

export default function hailAccept({
  state,
  invokeTime,
  characterID,
  gameID,
}: BridgeCommsHailAcceptParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  let apUsed: number
  let error: Error | null
  ;[apUsed, error] = getAPUsage(
    character!,
    HAIL_SKILL_MODIFIER,
    HAIL_AP_USAGE,
    HAIL_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  let traderResult: TraderShow | null
  ;[traderResult, error] = hailCalculate({ state, gameID })
  if (error !== null) return [null, error]

  stateCopy.ship[traderResult.taken.resource] -= traderResult.taken.amount
  stateCopy.ship[traderResult.given.resource] += traderResult.given.amount
  if (traderResult.items.size > 0) {
    const itemIDPrng = seedrandom(`${gameID}-${invokeTime}`)
    traderResult.items.forEach((item) => {
      for (let i = 0; i < item.given; i++) {
        if (stateCopy.ship.cargo.size < stateCopy.ship.maxCargoSize) {
          stateCopy.ship.cargo.add({
            id: GetRandomString(ITEM_ID_LENGTH, itemIDPrng),
            itemName: item.itemName,
            broken: false,
          })
        }
      }
    })
  }
  character!.cycleActions.set(invokeTime, 'action.bridge.comms.hail')
  character!.ap -= apUsed

  return [stateCopy, null]
}
