import {
  INVALID_INVENTORY_ITEM_NOT_FOUND,
  INVALID_REPAIR_ITEM_IS_NOT_BROKEN,
} from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { ItemNames } from '@nanosh/types/item'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import { GetWillDirty } from '@nanosh/utils/getWillDirty'
import seedrandom from 'seedrandom'
import DutifulDeprivedReduce from '../modifiers/traits/dutiful'

interface RndRepairParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID' | 'gameID'
  > {
  itemName?: ItemNames
  itemID?: string
}

const REPAIR_AP_USAGE = 2
const REPAIR_SKILL_MODIFIER = new Set<Skills>([
  'skill.adaptable',
  'skill.technician',
])
const REPAIR_SKILL_MODIFIER_AP_REDUCE = 1

export default function ({
  state,
  characterID,
  invokeTime,
  itemName,
  itemID,
  gameID,
}: RndRepairParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const inventory = Array.from(character!.inventory.values())
  const item = inventory.find((item) => {
    return item.itemName === itemName || item.id === itemID
  })
  if (!item) return [null, new Error(INVALID_INVENTORY_ITEM_NOT_FOUND)]

  if (!item.broken) return [null, new Error(INVALID_REPAIR_ITEM_IS_NOT_BROKEN)]

  const [apUsed, error] = getAPUsage(
    character!,
    REPAIR_SKILL_MODIFIER,
    REPAIR_AP_USAGE,
    REPAIR_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  item.broken = false

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const characterWillDirty = GetWillDirty(character!.trait, prng)

  if (characterWillDirty) {
    character?.modifiers.set('character.cycle.dirty', {
      start: {
        day: stateCopy.day,
        cycle: stateCopy.cycle,
      },
      expiry: {
        day: -1,
        cycle: -1,
      },
      amount: 1,
    })
  }

  character!.cycleActions.set(invokeTime, 'action.rnd.repair')
  character!.ap -= apUsed
  const [newState, _] = DutifulDeprivedReduce({ state: stateCopy, characterID })

  return [newState, null]
}
