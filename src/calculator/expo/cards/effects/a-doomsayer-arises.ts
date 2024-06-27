import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import { GameOverNanoshSympathy } from '@nanosh/utils/gameOver/nanoshSympathy'

interface DoomsayerParams extends Pick<GenericCalculatorParams, 'state'> {}

const DOOMSAYER_NANOSH_SYMPATHY_ADD = 1

export default function Doomsayer({
  state,
}: DoomsayerParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  stateCopy.nanoshSympathy += DOOMSAYER_NANOSH_SYMPATHY_ADD
  const [_, errorGameOver] = GameOverNanoshSympathy({ state: stateCopy })
  if (errorGameOver !== null) {
    return [null, errorGameOver]
  }

  return [stateCopy, null]
}
