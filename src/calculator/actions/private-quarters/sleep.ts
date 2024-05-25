import { INVALID_CYCLE_ACTION_NOT_EMPTY } from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import GetRandomWeightedBool from '@nanosh/utils/getRandomWeightedBool'
import seedrandom from 'seedrandom'

interface PrivateQuartersSleepParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'gameID' | 'invokeTime' | 'characterID'
  > {}

const SLEEP_AP_USAGE = 1
const SLEEP_AP_ADDITION = 2
const SLEEP_SICK_REMOVE_CHANCE = 40 // Percentage
const SLEEP_SICK_REMOVE_AMOUNT = 1
const SLEEP_DRUNK_REMOVE_AMOUNT = 1

export default function sleep({
  state,
  gameID,
  invokeTime,
  characterID,
}: PrivateQuartersSleepParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)

  if (character!.cycleActions.size > 0) {
    return [null, new Error(INVALID_CYCLE_ACTION_NOT_EMPTY)]
  }

  const [apUsed, error] = getAPUsage(
    character!,
    new Set<Skills>([]),
    SLEEP_AP_USAGE,
    0,
  )
  if (error !== null) return [null, error]

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const shouldRemoveSick =
    GetRandomWeightedBool(prng, SLEEP_SICK_REMOVE_CHANCE) &&
    character?.modifiers.has('character.persistent.sick')
  if (shouldRemoveSick) {
    const currentSick = character!.modifiers.get('character.persistent.sick')! // asserted above

    if (currentSick.amount > 1) {
      character?.modifiers.set('character.persistent.sick', {
        start: { ...currentSick.start },
        expiry: { ...currentSick.expiry },
        amount: currentSick.amount - SLEEP_SICK_REMOVE_AMOUNT,
      })
    } else {
      character?.modifiers.delete('character.persistent.sick')
    }
  }

  const currentDrunk = character!.modifiers.get('character.persistent.drunk')

  if (currentDrunk) {
    if (currentDrunk.amount > 1) {
      character?.modifiers.set('character.persistent.drunk', {
        start: { ...currentDrunk.start },
        expiry: { ...currentDrunk.expiry },
        amount: currentDrunk.amount - SLEEP_DRUNK_REMOVE_AMOUNT,
      })
    } else {
      character?.modifiers.delete('character.persistent.drunk')
    }
  }

  character?.modifiers.delete('character.cycle.tired')

  character!.cycleActions.set(invokeTime, 'action.private-quarters.sleep')
  character!.cycleActions.set(-1, 'action.private-quarters.sleep') // occupies all cycleActions
  character!.cycleActions.set(-2, 'action.private-quarters.sleep') // occupies all cycleActions
  character!.ap -= apUsed
  character!.ap += SLEEP_AP_ADDITION

  return [stateCopy, null]
}
