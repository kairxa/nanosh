import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { ModifierTimeDetail } from '@nanosh/types/modifiers'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import GetTargetExpiry from '@nanosh/utils/getTargetExpiry'
import { GetWillDirty } from '@nanosh/utils/getWillDirty'
import seedrandom from 'seedrandom'
import DutifulDeprivedReduce from '../modifiers/traits/dutiful'

interface FightercraftsRoomCalibrateParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'characterID' | 'invokeTime' | 'gameID'
  > {}

const CALIBRATE_AP_USAGE = 2
const CALIBRATE_SKILL_MODIFIER = new Set<Skills>(['skill.diligent'])
const CALIBRATE_SKILL_MODIFIER_AP_REDUCE = 1
const CALIBRATE_DURATION = 8

export default function ({
  state,
  invokeTime,
  characterID,
  gameID,
}: FightercraftsRoomCalibrateParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    CALIBRATE_SKILL_MODIFIER,
    CALIBRATE_AP_USAGE,
    CALIBRATE_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  const targetStart: ModifierTimeDetail = {
    day: stateCopy.day,
    cycle: stateCopy.cycle,
  }
  const targetExpiry = GetTargetExpiry(targetStart, CALIBRATE_DURATION)

  stateCopy.ship.modifiers.set('ship.persistent.buzzard.optimized', {
    start: targetStart,
    expiry: targetExpiry,
    amount: 1,
  })
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

  character!.cycleActions.set(invokeTime, 'action.fightercrafts-bay.calibrate')
  character!.ap -= apUsed
  const [newState, _] = DutifulDeprivedReduce({ state: stateCopy, characterID })

  return [newState, null]
}
