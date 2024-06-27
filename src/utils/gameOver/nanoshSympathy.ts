import { GAME_OVER } from '@nanosh/messages/errors'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'

interface NanoshSympathyProps extends Pick<GenericCalculatorParams, 'state'> {}

const NANOSH_SYMPATHY_MAX = 10

export function GameOverNanoshSympathy({
  state,
}: NanoshSympathyProps): DefaultCalculatorReturnType {
  if (state.nanoshSympathy >= NANOSH_SYMPATHY_MAX) {
    return [null, new Error(GAME_OVER)]
  }

  return [structuredClone(state), null]
}
