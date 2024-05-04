import type { Game } from '@nanosh/types/game'
import type { DefaultCalculatorReturnType } from '@nanosh/types/generic'

export function nanoshAssimilationProtocol(
  state: Game,
): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  stateCopy.nanosh.assimilateEnabled = true

  return [stateCopy, null]
}
