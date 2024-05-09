import { INVALID_COMPOUND_MEDS_NAME } from '@nanosh/messages/errors'
import {
  ITEM_ID_LENGTH,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { ItemNames } from '@nanosh/types/item'
import type { ShipCargo } from '@nanosh/types/ship'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import GetInventoryEmptySize from '@nanosh/utils/getInventoryEmptySize'
import GetRandomBool from '@nanosh/utils/getRandomBool'
import GetRandomString from '@nanosh/utils/getRandomString'
import { MedsCompound } from '@nanosh/utils/initialState/items'
import seedrandom from 'seedrandom'

interface MedlabCompoundParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'invokeTime' | 'gameID'
  > {
  medsName: ItemNames
}

const COMPOUND_AP_USAGE = 1
const COMPOUND_PHARMACOLOGIST_SUPPLIES_REDUCE_PERCENTAGE = 50

export default function ({
  state,
  characterID,
  gameID,
  invokeTime,
  medsName,
}: MedlabCompoundParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const medsDetail = MedsCompound.get(medsName)
  if (!medsDetail) {
    return [null, new Error(INVALID_COMPOUND_MEDS_NAME)]
  }

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    new Set<Skills>(),
    COMPOUND_AP_USAGE,
    0,
  )
  if (error !== null) return [null, error]

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  let usedSupplies = medsDetail.supplies
  let medsProduced = new Set<ShipCargo>([
    {
      id: GetRandomString(ITEM_ID_LENGTH, prng),
      itemName: medsName,
      broken: false,
    },
  ])

  if (character?.skills.has('skill.pharmacologist')) {
    usedSupplies = Math.floor(
      (usedSupplies * COMPOUND_PHARMACOLOGIST_SUPPLIES_REDUCE_PERCENTAGE) / 100,
    )

    const shouldDoubleProduce =
      GetRandomBool(prng) &&
      GetInventoryEmptySize(character.inventory.size, character.skills) >= 2 // A HACK LMAO, so make sure your inventory is always empty before compounding.

    if (shouldDoubleProduce) {
      medsProduced.add({
        id: GetRandomString(ITEM_ID_LENGTH, prng),
        itemName: medsName,
        broken: false,
      })
    }
  }

  stateCopy.ship.supplies -= usedSupplies
  medsProduced.forEach((meds) => {
    character!.inventory.add(meds)
  })
  character!.cycleActions.set(invokeTime, 'action.medlab.compound')
  character!.ap -= apUsed

  return [stateCopy, null]
}
