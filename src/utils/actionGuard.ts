import {
  INVALID_CHARACTER_DEAD,
  INVALID_CHARACTER_ID,
  INVALID_MAX_ACTIONS_PER_CYCLE_REACHED,
  INVALID_PLAYER_MISMATCH,
} from '@nanosh/messages/errors'
import type { Actions } from '@nanosh/types/actions'
import type { Game } from '@nanosh/types/game'
import {
  MAX_ACTIONS_PER_CYCLE,
  type GenericCalculatorParams,
} from '@nanosh/types/generic'

/**
 * Action Guard
 * Ensuring an action is valid before getting into AP usage and everything.
 * 1. Check if Character is found (not undefined)
 * 2. Check if Player inside Character is the same with playerID
 * 3. Check if Character is not Dead
 * 4. Check if Actions are valid, i.e. less than MAX_ACTIONS_PER_CYCLE or haven't sleep nor seggs this cycle.
 * @param { GenericCalculatorParams } GenericCalculatorParams
 * @param { Game } GenericCalculatorParams.state
 * @param { string } GenericCalculatorParams.playerID
 * @param { number } GenericCalculatorParams.characterID
 */
export default function ({
  state,
  playerID,
  characterID,
}: GenericCalculatorParams): [Game | null, Error | null] {
  const character = state.characters.get(characterID)
  if (!character) return [null, new Error(INVALID_CHARACTER_ID)]
  if (character.playerID !== playerID)
    return [null, new Error(INVALID_PLAYER_MISMATCH)]
  if (state.charactersDead.has(characterID))
    return [null, new Error(INVALID_CHARACTER_DEAD)]
  const cycleActions = new Set<Actions>(character.cycleActions.values())
  if (
    cycleActions.size === MAX_ACTIONS_PER_CYCLE ||
    cycleActions.has('action.private-quarters.sleep') ||
    cycleActions.has('action.private-quarters.seggs')
  )
    return [null, new Error(INVALID_MAX_ACTIONS_PER_CYCLE_REACHED)]

  return [state, null]
}
