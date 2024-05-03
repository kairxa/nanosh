import type { Game } from '@nanosh/types/game'
import type { DefaultCalculatorReturnType } from '@nanosh/types/generic'

export function placeholder(state: Game): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  return [stateCopy, null]
}
