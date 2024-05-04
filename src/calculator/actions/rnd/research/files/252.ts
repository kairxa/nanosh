import type { Game } from '@nanosh/types/game'
import type { DefaultCalculatorReturnType } from '@nanosh/types/generic'

export function hyperhealAmpoule(state: Game): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  stateCopy.craftable.add('item.hyperheal-ampoule')

  return [stateCopy, null]
}
