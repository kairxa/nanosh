import { INVALID_CHARACTER_DIRTY } from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface RefectoryProvisionParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID'
  > {}

const PROVISION_AP_USAGE = 1
const PROVISION_SUPPLIES_USAGE = 8
const PROVISION_RATIONS_YIELD = 4
const PROVISION_ADAPTABLE_RATIONS_MULTIPLIER = 125 // percent
const PROVISION_COOK_RATIONS_MULTIPLIER = 150 // percent
const PROVISION_DUTIFUL_DEPRIVED_REDUCE = 1

export default function ({
  state,
  characterID,
  invokeTime,
}: RefectoryProvisionParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)

  if (character!.modifiers.has('character.cycle.dirty')) {
    return [null, new Error(INVALID_CHARACTER_DIRTY)]
  }

  const [apUsed, error] = getAPUsage(
    character!,
    new Set<Skills>(),
    PROVISION_AP_USAGE,
    0,
  )
  if (error !== null) return [null, error]

  let rationsYieldMultiplier = 100
  if (character?.skills.has('skill.adaptable')) {
    rationsYieldMultiplier = PROVISION_ADAPTABLE_RATIONS_MULTIPLIER
  }
  if (character?.skills.has('skill.cook')) {
    rationsYieldMultiplier = PROVISION_COOK_RATIONS_MULTIPLIER
  }

  const rationsYield = Math.floor(
    (PROVISION_RATIONS_YIELD * rationsYieldMultiplier) / 100,
  )

  if (character?.trait.has('trait.dutiful')) {
    const currentDeprived = character.modifiers.get('character.cycle.deprived')!
    const targetDeprivedAmount =
      currentDeprived!.amount - PROVISION_DUTIFUL_DEPRIVED_REDUCE
    character.modifiers.set('character.cycle.deprived', {
      start: { ...currentDeprived!.start },
      expiry: { ...currentDeprived!.expiry },
      amount: Math.max(targetDeprivedAmount, 0),
    })
  }
  stateCopy.ship.supplies -= PROVISION_SUPPLIES_USAGE
  stateCopy.ship.rations += rationsYield
  character!.cycleActions.set(invokeTime, 'action.refectory.provision')
  character!.ap -= apUsed

  return [stateCopy, null]
}
