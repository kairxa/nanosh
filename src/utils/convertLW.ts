import {
  LW_CW_CONVERSION_AMOUNT,
  type DefaultCalculatorReturnType,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'

interface ConvertLWParams
  extends Pick<GenericCalculatorParams, 'state' | 'characterID'> {}

/**
 * ConvertLW
 * Will always return null error.
 * Converts LW to CW by 3 to 1 rate.
 */
export default function ConvertLW({
  state,
  characterID,
}: ConvertLWParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)

  const currentLw = character?.modifiers.get('character.wound.light')
  if (!currentLw) return [stateCopy, null]

  const cwAdd = Math.floor(currentLw.amount / LW_CW_CONVERSION_AMOUNT)
  const lw = currentLw.amount % LW_CW_CONVERSION_AMOUNT
  let currentCw = character?.modifiers.get('character.wound.critical')
  if (!currentCw) {
    currentCw = {
      start: { day: stateCopy.day, cycle: stateCopy.cycle },
      expiry: { day: -1, cycle: -1 },
      amount: 0,
    }
  }

  if (lw > 0) {
    character?.modifiers.set('character.wound.light', {
      ...currentLw,
      amount: lw,
    })
  } else {
    character?.modifiers.delete('character.wound.light')
  }
  if (cwAdd > 0) {
    character?.modifiers.set('character.wound.critical', {
      ...currentCw,
      amount: currentCw.amount + cwAdd,
    })
  }

  return [stateCopy, null]
}
