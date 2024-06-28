import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'

interface SmallLeadParams extends Pick<GenericCalculatorParams, 'state'> {}

const SMALL_LEAD_INTEL_BASIC_ADD = 1

export default function SmallLead({
  state,
}: SmallLeadParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  stateCopy.intel.basic += SMALL_LEAD_INTEL_BASIC_ADD

  return [stateCopy, null]
}
