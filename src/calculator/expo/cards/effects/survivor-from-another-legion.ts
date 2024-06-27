import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'

interface SurvivorLegionParams extends Pick<GenericCalculatorParams, 'state'> {}

const SURVIVOR_LEGION_PRAETORIAN_ADD = 1

export default function SurvivorLegion({
  state,
}: SurvivorLegionParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  stateCopy.ship.praetorians += SURVIVOR_LEGION_PRAETORIAN_ADD

  return [stateCopy, null]
}
