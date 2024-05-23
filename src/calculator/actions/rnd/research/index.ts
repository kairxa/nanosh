import {
  FATAL_RESEARCH_PROJECT_NAME_NOT_FOUND,
  INVALID_CHARACTER_DIRTY,
  INVALID_RESEARCH_QUEUE_ID_MISMATCH,
} from '@nanosh/messages/errors'
import type { Game } from '@nanosh/types/game'
import {
  PROJECT_QUEUE_MAX_SIZE,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import GetRandomBool from '@nanosh/utils/getRandomBool'
import { Projects } from '@nanosh/utils/initialState/projects'
import seedrandom from 'seedrandom'

interface BridgeRndResearchProgressParams
  extends Pick<
    GenericCalculatorParams,
    'invokeTime' | 'characterID' | 'state' | 'gameID'
  > {
  queueID: number
}

const RESEARCH_AP_USAGE = 2
const RESEARCH_SKILL_MODIFIERS_BIO = new Set<Skills>([
  'skill.pharmacologist',
  'skill.physician',
])
const RESEARCH_SKILL_MODIFIERS_BIO_ADDITION = 1
const RESEARCH_SKILL_MODIFIERS_TECHGI = new Set<Skills>([
  'skill.engineer',
  'skill.technician',
])
const RESEARCH_SKILL_MODIFIERS_TECHGI_ADDITION = 1
const RESEARCH_SKILL_MODIFIERS_SAVANT: Skills = 'skill.savant'
const RESEARCH_SKILL_MODIFIERS_SAVANT_ADDITION = 1
// RESEARCH_SKILL_MODIFIERS_SAVANT_CHANCE = 50% therefore we will use GetRandomBool
const RESEARCH_DEFAULT_ADDITION = 1

export function researchProgress({
  state,
  gameID,
  invokeTime,
  characterID,
  queueID, // NOT ZERO BASED. Starts from 1.
}: BridgeRndResearchProgressParams): DefaultCalculatorReturnType {
  if (queueID <= 0 || queueID > PROJECT_QUEUE_MAX_SIZE) {
    return [null, new Error(INVALID_RESEARCH_QUEUE_ID_MISMATCH)]
  }

  let stateCopy: Game | null = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  if (character?.modifiers.has('character.cycle.dirty')) {
    return [null, new Error(INVALID_CHARACTER_DIRTY)]
  }

  let apUsed: number = RESEARCH_AP_USAGE
  let error: Error | null
  ;[apUsed, error] = getAPUsage(
    character!,
    new Set<Skills>(),
    RESEARCH_AP_USAGE,
    0,
  )
  if (error !== null) return [null, error]

  const selectedProjectName = Array.from(stateCopy.ship.projects.queued.keys())[
    queueID - 1
  ] // QUEUE ID IS NOT ZERO BASED
  const currentProject = stateCopy.ship.projects.queued.get(selectedProjectName)
  if (!currentProject)
    return [null, new Error(FATAL_RESEARCH_PROJECT_NAME_NOT_FOUND)]

  const prng = seedrandom(`${gameID}-${invokeTime}`)

  // Reference projectDetail from Projects
  const projectDetail = Projects.get(selectedProjectName)
  if (!projectDetail)
    return [null, new Error(FATAL_RESEARCH_PROJECT_NAME_NOT_FOUND)]

  const isProjectBio = projectDetail?.type.has('Bio')
  const isProjectTechGi = projectDetail?.type.has('TechGi')

  let progressGiven = RESEARCH_DEFAULT_ADDITION
  const characterSkills = character?.skills || new Set<Skills>()

  if (isProjectBio) {
    RESEARCH_SKILL_MODIFIERS_BIO.forEach((skill) => {
      if (characterSkills.has(skill)) {
        progressGiven += RESEARCH_SKILL_MODIFIERS_BIO_ADDITION
      }
    })
  }

  if (isProjectTechGi) {
    RESEARCH_SKILL_MODIFIERS_TECHGI.forEach((skill) => {
      if (characterSkills.has(skill)) {
        progressGiven += RESEARCH_SKILL_MODIFIERS_TECHGI_ADDITION
      }
    })
  }

  if (characterSkills.has(RESEARCH_SKILL_MODIFIERS_SAVANT)) {
    const shouldAddProgress = GetRandomBool(prng)
    if (shouldAddProgress)
      progressGiven += RESEARCH_SKILL_MODIFIERS_SAVANT_ADDITION
  }

  currentProject.progressCurrent += progressGiven
  if (currentProject.progressCurrent >= projectDetail.progressNeeded) {
    stateCopy.ship.projects.queued.delete(selectedProjectName)
    stateCopy.ship.projects.done.add(selectedProjectName)
    ;[stateCopy, error] = projectDetail.completedCallback(stateCopy)
  }
  if (error !== null) return [null, error]

  character?.cycleActions.set(invokeTime, 'action.rnd.research')
  character!.ap -= apUsed

  return [stateCopy, null]
}
