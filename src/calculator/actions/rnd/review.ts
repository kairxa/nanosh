import { INVALID_PROJECT_QUEUE_MAX_REACHED } from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { ProjectNames } from '@nanosh/types/projects'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import { GetRandomSet } from '@nanosh/utils/getRandomArray'
import seedrandom from 'seedrandom'

interface RndReviewParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'gameID' | 'invokeTime' | 'characterID'
  > {}

const REVIEW_QUEUE_MAX_SIZE = 3
const REVIEW_AP_USAGE = 2
const REVIEW_SKILL_MODIFIER = new Set<Skills>(['skill.savant'])
const REVIEW_SKILL_MODIFIER_AP_REDUCE = 1
const REVIEW_RETRIEVE_AMOUNT = 1

export default function ({
  state,
  gameID,
  invokeTime,
  characterID,
}: RndReviewParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (stateCopy.ship.projects.queued.size >= REVIEW_QUEUE_MAX_SIZE) {
    return [null, new Error(INVALID_PROJECT_QUEUE_MAX_REACHED)]
  }

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    REVIEW_SKILL_MODIFIER,
    REVIEW_AP_USAGE,
    REVIEW_SKILL_MODIFIER_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const newProject = GetRandomSet(
    stateCopy.ship.projects.pool,
    REVIEW_RETRIEVE_AMOUNT,
    prng,
  )
    .values()
    .next().value as ProjectNames

  stateCopy.ship.projects.pool.delete(newProject)
  stateCopy.ship.projects.queued.set(newProject, { progressCurrent: 0 })
  character?.cycleActions.set(invokeTime, 'action.rnd.review')
  character!.ap -= apUsed

  return [stateCopy, null]
}
