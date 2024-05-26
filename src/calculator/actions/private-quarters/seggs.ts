import {
  INVALID_CYCLE_ACTION_NOT_EMPTY,
  INVALID_SEGGS_TARGET_IS_SELF,
} from '@nanosh/messages/errors'
import type { CharacterNames } from '@nanosh/types/character'
import {
  MAX_CYCLE_PER_DAY,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import { GetWillUplifted } from '@nanosh/utils/getWillUplifted'

interface PrivateQuartersSeggsParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'invokeTime'
  > {
  targetID: CharacterNames
}

const SEGGS_AP_USAGE = 1

export default function ({
  state,
  characterID,
  invokeTime,
  targetID,
}: PrivateQuartersSeggsParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (
    characterID === targetID &&
    !stateCopy.ship.projects.done.has('File E120 - Solo Comfort Initiative')
  ) {
    return [null, new Error(INVALID_SEGGS_TARGET_IS_SELF)]
  }

  const character = stateCopy.characters.get(characterID)
  const target = stateCopy.characters.get(targetID)

  if (character!.cycleActions.size > 0 || target!.cycleActions.size > 0) {
    return [null, new Error(INVALID_CYCLE_ACTION_NOT_EMPTY)]
  }

  const [apUsed, error] = getAPUsage(
    character!,
    new Set<Skills>(),
    SEGGS_AP_USAGE,
    0,
  )
  if (error !== null) return [null, error]

  const characterWillUplifted = GetWillUplifted(
    character!.trait,
    character!.modifiers,
  )
  if (characterWillUplifted) {
    character?.modifiers.delete('character.cycle.frustrated')
    character?.modifiers.set('character.day-change.uplifted', {
      start: { day: stateCopy.day, cycle: stateCopy.cycle },
      expiry: { day: stateCopy.day, cycle: MAX_CYCLE_PER_DAY },
      amount: 1,
    })
  }
  character?.cycleActions.set(invokeTime, 'action.private-quarters.seggs')
  character?.cycleActions.set(-1, 'action.private-quarters.seggs')
  character?.cycleActions.set(-2, 'action.private-quarters.seggs')
  character!.ap -= apUsed
  character?.modifiers.delete('character.cycle.deprived')

  if (characterID !== targetID) {
    const [targetAPUsed, targetError] = getAPUsage(
      target!,
      new Set<Skills>(),
      SEGGS_AP_USAGE,
      0,
    )
    if (targetError !== null) return [null, error]

    const targetWillUplifted = GetWillUplifted(target!.trait, target!.modifiers)
    if (targetWillUplifted) {
      target?.modifiers.delete('character.cycle.frustrated')
      target?.modifiers.set('character.day-change.uplifted', {
        start: { day: stateCopy.day, cycle: stateCopy.cycle },
        expiry: { day: stateCopy.day, cycle: MAX_CYCLE_PER_DAY },
        amount: 1,
      })
    }
    target?.cycleActions.set(invokeTime, 'action.private-quarters.seggs')
    target?.cycleActions.set(-1, 'action.private-quarters.seggs')
    target?.cycleActions.set(-2, 'action.private-quarters.seggs')
    target!.ap -= targetAPUsed
    target?.modifiers.delete('character.cycle.deprived')
  }

  return [stateCopy, null]
}
