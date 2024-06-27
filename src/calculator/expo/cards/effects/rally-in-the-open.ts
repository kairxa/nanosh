import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'

interface RallyOpenParams extends Pick<GenericCalculatorParams, 'state'> {}

const RALLY_OPEN_PRAETORIAN_ADD = 1

export default function RallyOpen({
  state,
}: RallyOpenParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  stateCopy.ship.praetorians += RALLY_OPEN_PRAETORIAN_ADD

  return [stateCopy, null]
}
