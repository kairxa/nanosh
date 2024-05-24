import {
  INVALID_NOT_ENOUGH_SUPPLIES,
  INVALID_SURGERY_TARGET_NOT_WOUNDED,
} from '@nanosh/messages/errors'
import type { CharacterNames } from '@nanosh/types/character'
import {
  MAX_CYCLE_PER_DAY,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import getAPUsage from '@nanosh/utils/getAPUsage'
import GetRandomWeightedBool from '@nanosh/utils/getRandomWeightedBool'
import seedrandom from 'seedrandom'

interface MedlabSurgeryParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'gameID' | 'invokeTime' | 'characterID'
  > {
  targetID: CharacterNames
}

const SURGERY_AP_USAGE = 3
const SURGERY_SUPPLIES_USAGE = 9
const SURGERY_BASE_SUCCESS_CHANCE = 40 // percent
const SURGERY_DRUNK_TIRED_SUCCESS_REDUCE = 10 // percent, per drunk or tired
const SURGERY_TIRED_ADDITION = 1
const SURGERY_SKILL_MODIFIERS = new Set<Skills>([
  'skill.physician',
  'skill.surgeon',
])
const SURGERY_SKILL_MODIFIERS_AP_REDUCE = 1
const SURGERY_SURGEON_BASE_CHANCE = SURGERY_BASE_SUCCESS_CHANCE * 2
const SURGERY_FILE_253_BASE_CHANCE_ADDITION = 20
const SURGERY_FILE_254_BASE_CHANCE_MULTIPLIER = 1.5
const SURGERY_METICULOUS_BASE_CHANCE = 100
const SURGERY_CW_REDUCE = 1
const SURGERY_SELF_PENALTY_MULTIPLIER = 2

export default function ({
  state,
  gameID,
  invokeTime,
  characterID,
  targetID,
}: MedlabSurgeryParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  if (stateCopy.ship.supplies < SURGERY_SUPPLIES_USAGE) {
    return [null, new Error(INVALID_NOT_ENOUGH_SUPPLIES)]
  }

  const character = stateCopy.characters.get(characterID)
  let apUsed: number
  let error: Error | null = null
  ;[apUsed, error] = getAPUsage(
    character!,
    SURGERY_SKILL_MODIFIERS,
    SURGERY_AP_USAGE,
    SURGERY_SKILL_MODIFIERS_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  if (targetID === characterID) apUsed *= SURGERY_SELF_PENALTY_MULTIPLIER

  const target = stateCopy.characters.get(targetID)
  if (!target?.modifiers.has('character.wound.critical')) {
    return [null, new Error(INVALID_SURGERY_TARGET_NOT_WOUNDED)]
  }

  let successChance = SURGERY_BASE_SUCCESS_CHANCE
  if (character?.skills.has('skill.surgeon')) {
    successChance = SURGERY_SURGEON_BASE_CHANCE
  }
  if (stateCopy.ship.projects.done.has('File 253 - Lifesaver Initiative')) {
    successChance += SURGERY_FILE_253_BASE_CHANCE_ADDITION
  }
  if (
    stateCopy.ship.projects.done.has('File 254 - Operational Surge Paradigm')
  ) {
    successChance = Math.min(
      successChance * SURGERY_FILE_254_BASE_CHANCE_MULTIPLIER,
      100,
    )
  }
  if (character?.trait.has('trait.meticulous')) {
    successChance = SURGERY_METICULOUS_BASE_CHANCE
  }
  const drunkAmount =
    character?.modifiers.get('character.persistent.drunk')?.amount || 0
  const tiredAmount =
    character?.modifiers.get('character.cycle.tired')?.amount || 0
  successChance -=
    (drunkAmount + tiredAmount) * SURGERY_DRUNK_TIRED_SUCCESS_REDUCE

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const isSurgerySuccess = GetRandomWeightedBool(prng, successChance)
  if (isSurgerySuccess) {
    const currentCritical = target.modifiers.get('character.wound.critical')! // already asserted abov
    const currentStabilizedCritical = target.modifiers.get(
      'character.wound.stabilized.critical',
    ) || {
      start: { day: stateCopy.day, cycle: stateCopy.cycle },
      expiry: { day: stateCopy.day, cycle: MAX_CYCLE_PER_DAY },
      amount: 0,
    }

    if (currentCritical.amount > 1) {
      target.modifiers.set('character.wound.critical', {
        start: { ...currentCritical.start },
        expiry: { ...currentCritical.expiry },
        amount: currentCritical.amount - SURGERY_CW_REDUCE,
      })
    } else {
      target.modifiers.delete('character.wound.critical')
    }

    target.modifiers.set('character.wound.stabilized.critical', {
      start: { ...currentStabilizedCritical.start },
      expiry: { ...currentStabilizedCritical.expiry },
      amount: currentStabilizedCritical.amount + SURGERY_CW_REDUCE,
    })
  }

  const currentCharacterTired = character?.modifiers.get(
    'character.cycle.tired',
  ) || {
    start: { day: stateCopy.day, cycle: stateCopy.cycle },
    expiry: { day: stateCopy.day, cycle: MAX_CYCLE_PER_DAY },
    amount: 0,
  }
  const currentTargetTired = target.modifiers.get('character.cycle.tired') || {
    start: { day: stateCopy.day, cycle: stateCopy.cycle },
    expiry: { day: stateCopy.day, cycle: MAX_CYCLE_PER_DAY },
    amount: 0,
  }

  character?.modifiers.set('character.cycle.tired', {
    start: { ...currentCharacterTired.start },
    expiry: { ...currentCharacterTired.expiry },
    amount: currentCharacterTired.amount + SURGERY_TIRED_ADDITION,
  })
  target.modifiers.set('character.cycle.tired', {
    start: { ...currentTargetTired.start },
    expiry: { ...currentTargetTired.expiry },
    amount: currentTargetTired.amount + SURGERY_TIRED_ADDITION,
  })
  stateCopy.ship.supplies -= SURGERY_SUPPLIES_USAGE
  character!.cycleActions.set(invokeTime, 'action.medlab.surgery')
  character!.ap -= apUsed

  return [stateCopy, null]
}
