import {
  MAX_CYCLE_PER_DAY,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { ModifiersShip } from '@nanosh/types/modifiers'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import getRandomNumber from '@nanosh/utils/getRandomNumber'
import seedrandom from 'seedrandom'

interface BridgeGardenForageParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'gameID' | 'characterID' | 'invokeTime'
  > {}

const FORAGE_AP_USAGE = 2
const FORAGE_SKILL_MODIFIER = new Set<Skills>(['skill.botanist'])
const FORAGE_SKILL_MODIFIER_AP_REDUCE = 1
const FORAGE_MIN_RESOURCE = 6
const FORAGE_MAX_RESOUCE = 8
const FORAGE_MODIFIER_RESULT: ModifiersShip = 'ship.day-change.garden.forage'

export default function ({
  state,
  gameID,
  characterID,
  invokeTime,
}: BridgeGardenForageParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    FORAGE_SKILL_MODIFIER,
    FORAGE_AP_USAGE,
    FORAGE_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const givenAmount = getRandomNumber(
    FORAGE_MIN_RESOURCE,
    FORAGE_MAX_RESOUCE,
    prng,
  )

  stateCopy.ship.modifiers.set(FORAGE_MODIFIER_RESULT, {
    amount: 1,
    start: { day: stateCopy.day, cycle: stateCopy.cycle },
    expiry: { day: stateCopy.day, cycle: MAX_CYCLE_PER_DAY },
  })
  stateCopy.ship.supplies += givenAmount
  character?.cycleActions.set(invokeTime, 'action.bridge.garden.forage')
  character!.ap -= apUsed

  return [stateCopy, null]
}