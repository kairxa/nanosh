import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'

interface BridgeCommsMusicParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID'
  > {}

const MUSIC_AP_USAGE = 1
const MUSIC_CREW_MORALE_ADDITION = 2
const MUSIC_SKILL_MODIFIER: Set<Skills> = new Set<Skills>(['skill.comms-savvy'])
const MUSIC_SKILL_MODIFIER_AP_REDUCE = 1

export default function ({
  state,
  invokeTime,
  characterID,
}: BridgeCommsMusicParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    MUSIC_SKILL_MODIFIER,
    MUSIC_AP_USAGE,
    MUSIC_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  stateCopy.morale = Math.min(
    stateCopy.morale + MUSIC_CREW_MORALE_ADDITION,
    stateCopy.maxMorale,
  )
  character!.cycleActions.set(invokeTime, 'action.bridge.comms.music')
  character!.ap -= apUsed

  return [stateCopy, null]
}
