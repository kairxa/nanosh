import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'

interface KillCharacterFromWoundPerhapsParams
  extends Pick<GenericCalculatorParams, 'state' | 'characterID'> {
  isDayChange: boolean
}

const BASE_CW_DEATH_AMOUNT = 3
const DROID_TOTAL_WOUND_DEATH_AMOUNT = 10
const STALWART_CW_DEATH_ADD = 1

export default function KillCharacterFromWoundPerhaps({
  state,
  characterID,
  isDayChange = false,
}: KillCharacterFromWoundPerhapsParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  if (!character?.modifiers.has('character.wound.critical')) {
    return [stateCopy, null]
  }

  if (character.trait.has('trait.droid')) {
    const cw = character.modifiers.get('character.wound.critical')?.amount || 0
    const lw = character.modifiers.get('character.wound.light')?.amount || 0

    if (cw + lw >= DROID_TOTAL_WOUND_DEATH_AMOUNT) {
      stateCopy.characters.delete(characterID)
      stateCopy.charactersDead.add(characterID)
    }

    return [stateCopy, null]
  }

  let cwDeathAmount = BASE_CW_DEATH_AMOUNT
  if (character?.skills.has('skill.stalwart')) {
    cwDeathAmount += STALWART_CW_DEATH_ADD
  }

  if (
    character?.modifiers.get('character.wound.critical')!.amount >=
    cwDeathAmount
  ) {
    stateCopy.characters.delete(characterID)
    stateCopy.charactersDead.add(characterID)

    return [stateCopy, null]
  }

  if (isDayChange) {
    if (character.trait.has('trait.regenesis')) {
      return [stateCopy, null]
    }

    if (character.modifiers.has('character.wound.critical')) {
      stateCopy.characters.delete(characterID)
      stateCopy.charactersDead.add(characterID)
    }

    return [stateCopy, null]
  }

  // Should be unreachable since the only way to get here is
  // by having critical wound modifier with 0 amount.
  return [stateCopy, null]
}
