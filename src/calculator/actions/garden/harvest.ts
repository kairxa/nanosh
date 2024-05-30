import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import GetRandomNumber from '@nanosh/utils/getRandomNumber'
import { GetWillDirty } from '@nanosh/utils/getWillDirty'
import seedrandom from 'seedrandom'
import dutifulDeprivedReduce from '../modifiers/traits/dutiful'

interface GardenHarvestParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'gameID' | 'invokeTime' | 'characterID'
  > {}

const HARVEST_AP_USAGE = 2
const HARVEST_SKILL_MODIFIER = new Set<Skills>(['skill.botanist'])
const HARVEST_SKILL_MODIFIER_AP_REDUCE = 1
const HARVEST_MIN_RESOURCE = 8
const HARVEST_MAX_RESOURCE = 10
const HARVEST_SHIP_MODIFIER_PERCENTAGE_CHANGE = 50

export default function ({
  state,
  gameID,
  invokeTime,
  characterID,
}: GardenHarvestParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    HARVEST_SKILL_MODIFIER,
    HARVEST_AP_USAGE,
    HARVEST_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  let givenModifierPercentage = 100
  if (stateCopy.ship.modifiers.has('ship.persistent.garden.sapped')) {
    givenModifierPercentage -= HARVEST_SHIP_MODIFIER_PERCENTAGE_CHANGE
  }
  if (stateCopy.ship.modifiers.has('ship.persistent.garden.bountiful')) {
    givenModifierPercentage += HARVEST_SHIP_MODIFIER_PERCENTAGE_CHANGE
  }

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  let givenRation = GetRandomNumber(
    HARVEST_MIN_RESOURCE,
    HARVEST_MAX_RESOURCE,
    prng,
  )
  givenRation = Math.floor(givenRation * (givenModifierPercentage / 100))

  stateCopy.ship.modifiers.delete('ship.persistent.garden.bountiful')
  stateCopy.ship.modifiers.delete('ship.persistent.garden.sapped')
  stateCopy.ship.rations += givenRation
  const characterWillDirty = GetWillDirty(character!.trait, prng)

  if (characterWillDirty) {
    character?.modifiers.set('character.cycle.dirty', {
      amount: 1,
      start: {
        day: stateCopy.day,
        cycle: stateCopy.cycle,
      },
      expiry: {
        day: -1,
        cycle: -1,
      },
    })
  }
  character!.cycleActions.set(invokeTime, 'action.garden.harvest')
  character!.ap -= apUsed
  const [newState, _] = dutifulDeprivedReduce({ state: stateCopy, characterID })

  return [newState, null]
}
