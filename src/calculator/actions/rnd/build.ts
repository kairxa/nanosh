import {
  INVALID_BUILD_ITEM_NAME_NOT_CRAFTABLE,
  INVALID_BUILD_NOT_ENOUGH_RESOURCES,
} from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { ItemNames } from '@nanosh/types/item'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import { GetWillDirty } from '@nanosh/utils/getWillDirty'
import { ItemBuilds } from '@nanosh/utils/initialState/items'
import seedrandom from 'seedrandom'

interface RndBuildParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'gameID' | 'invokeTime' | 'characterID'
  > {
  itemName: ItemNames
}

const BUILD_AP_USAGE = 2
const BUILD_SKILL_MODIFIER = new Set<Skills>(['skill.artisan'])
const BUILD_SKILL_MODIFIER_AP_REDUCE = 1
const BUILD_ARTISAN_DEPRIVED_REDUCE = 2
const BUILD_ENGINEER_RESOURCES_REDUCE_PCT = 30 // 30% less materials

export default function rndbuild({
  state,
  gameID,
  invokeTime,
  characterID,
  itemName,
}: RndBuildParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (!stateCopy.craftable.has(itemName)) {
    return [null, new Error(INVALID_BUILD_ITEM_NAME_NOT_CRAFTABLE)]
  }

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    BUILD_SKILL_MODIFIER,
    BUILD_AP_USAGE,
    BUILD_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  const itemBuildData = ItemBuilds.get(itemName)! // will always be found since we limit things inside stateCopy.craftable
  const resourcesUsage = {
    eCells: itemBuildData.eCells,
    rations: itemBuildData.rations,
    supplies: itemBuildData.supplies,
  }
  if (character?.skills.has('skill.engineer')) {
    resourcesUsage.eCells -= Math.ceil(
      (resourcesUsage.eCells * BUILD_ENGINEER_RESOURCES_REDUCE_PCT) / 100,
    )
    resourcesUsage.rations -= Math.ceil(
      (resourcesUsage.rations * BUILD_ENGINEER_RESOURCES_REDUCE_PCT) / 100,
    )
    resourcesUsage.supplies -= Math.ceil(
      (resourcesUsage.supplies * BUILD_ENGINEER_RESOURCES_REDUCE_PCT) / 100,
    )
  }

  if (
    stateCopy.ship.eCells < resourcesUsage.eCells ||
    stateCopy.ship.rations < resourcesUsage.rations ||
    stateCopy.ship.supplies < resourcesUsage.supplies
  ) {
    return [null, new Error(INVALID_BUILD_NOT_ENOUGH_RESOURCES)]
  }

  stateCopy.ship.eCells -= resourcesUsage.eCells
  stateCopy.ship.rations -= resourcesUsage.rations
  stateCopy.ship.supplies -= resourcesUsage.supplies

  if (character?.skills.has('skill.artisan')) {
    const currentDeprived = character.modifiers.get(
      'character.cycle.deprived',
    ) || {
      start: {
        day: stateCopy.day,
        cycle: stateCopy.cycle,
      },
      expiry: {
        day: -1,
        cycle: -1,
      },
      amount: 0,
    }
    character.modifiers.set('character.cycle.deprived', {
      ...currentDeprived,
      amount: Math.max(
        currentDeprived.amount - BUILD_ARTISAN_DEPRIVED_REDUCE,
        0,
      ),
    })
  }

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

  character?.cycleActions.set(invokeTime, 'action.rnd.build')
  character!.ap -= apUsed

  return [stateCopy, null]
}
